import { useEffect, useState } from 'react';
import { getMarketDataBySlug, getOutcomeName } from '@/utils';
import { type WalletEntry } from '@/types';
import { getEventDataBySlug } from '@/services/polymarket';
import { CENTS_PER_DOLLAR } from '@/utils/constants';

interface HistoryProps {
    isActive: boolean;
}

interface EnrichedHistoryEntry extends WalletEntry {
    eventTitle?: string;
    marketQuestion?: string;
    outcome?: string;
    eventUrl?: string;
    marketUrl?: string;
}

export default function History({ isActive }: HistoryProps) {
    const [history, setHistory] = useState<EnrichedHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isActive) {
            loadHistory();
        }
    }, [isActive]);

    const loadHistory = async () => {
        setLoading(true);
        const data = await chrome.storage.local.get(['walletHistory']);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawHistory: WalletEntry[] = (data.walletHistory as any[]) || [];

        if (rawHistory.length === 0) {
            setHistory([]);
            setLoading(false);
            return;
        }

        const reversed = [...rawHistory].reverse();
        const enriched = await Promise.all(
            reversed.map(async (entry) => {
                let eventTitle = 'Unknown Event';
                let marketQuestion = `Market: ${entry.marketSlug}`;
                let outcome = 'Unknown';
                let eventUrl = '#';
                let marketUrl = '#';

                try {
                    const eventData = await getEventDataBySlug(entry.eventSlug);
                    eventTitle = eventData.title || eventTitle;
                    const eventSlug = eventData.slug || '';
                    eventUrl = `https://polymarket.com/event/${eventSlug}`;

                    const market = getMarketDataBySlug(eventData, entry.marketSlug);
                    if (market) {
                        marketQuestion = market.question;
                        marketUrl = `https://polymarket.com/event/${eventSlug}${market.slug ? '/' + market.slug : ''}`;
                        outcome = getOutcomeName(market, entry.clobTokenId);
                    }
                } catch (e) {
                    console.error('Error fetching event data for history:', e);
                }

                return {
                    ...entry,
                    eventTitle,
                    marketQuestion,
                    outcome,
                    eventUrl,
                    marketUrl,
                };
            })
        );

        setHistory(enriched);
        setLoading(false);
    };

    if (!isActive) return null;

    if (loading) {
        return (
            <div className="history">
                <div className="loading">
                    <div className="spinner"></div>
                    Loading history...
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="history">
                <div className="empty-state">
                    <div className="empty-icon">📜</div>
                    <div>No trades yet</div>
                </div>
            </div>
        );
    }

    return (
        <div className="history">
            {history.map((entry, index) => {
                const sideClass = entry.side === 'BUY' ? 'buy' : 'sell';
                const date = new Date(entry.timestamp).toLocaleString();

                return (
                    <div key={index} className="history-entry">
                        <div className="entry-header">
                            <div className="entry-info">
                                <a href={entry.eventUrl} target="_blank" className="entry-event">
                                    {entry.eventTitle}
                                </a>
                                <a href={entry.marketUrl} target="_blank" className="entry-market">
                                    {entry.marketQuestion}
                                </a>
                            </div>
                            <div className="entry-amounts">
                                <span className="entry-amount">${entry.totalValue.toFixed(2)}</span>
                                <span className="entry-balance">→ ${entry.remainingBalance.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="entry-outcome">
                            <span className={`outcome-badge ${entry.outcome?.toLowerCase()}`}>{entry.outcome}</span>
                        </div>
                        <div className="entry-footer">
                            <div className="entry-details">
                                <span className={`side-text ${sideClass}`}>{entry.side}</span> • Price:{' '}
                                {(entry.price * CENTS_PER_DOLLAR).toFixed(1)}¢ • Shares: {entry.shares.toFixed(2)}
                            </div>
                            <span className="entry-date">{date}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
