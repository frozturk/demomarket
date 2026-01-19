import { Holding } from '../types';
import { CENTS_PER_DOLLAR } from '@/utils/constants';

interface HoldingsProps {
    holdings: Holding[];
    loading: boolean;
}

export default function Holdings({ holdings, loading }: HoldingsProps) {
    if (loading) {
        return (
            <div className="holdings">
                <div className="loading">
                    <div className="spinner"></div>
                    Loading your positions...
                </div>
            </div>
        );
    }

    if (holdings.length === 0) {
        return (
            <div className="holdings">
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <div>No holdings yet</div>
                    <div className="empty-hint">
                        Visit{' '}
                        <a
                            href="https://polymarket.com"
                            target="_blank"
                            style={{ color: '#60a5fa', textDecoration: 'inherit' }}
                        >
                            Polymarket
                        </a>{' '}
                        and use the Demo button to simulate trades
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="holdings">
            {holdings.map((h) => {
                const profit = h.profit || 0;
                const isPositive = profit >= 0;

                return (
                    <div key={h.tokenId} className="holding-card">
                        <a href={h.eventUrl || '#'} target="_blank" className="event-title">
                            {h.eventTitle || 'Unknown Event'}
                        </a>
                        <a href={h.marketUrl || '#'} target="_blank" className="market-question">
                            {h.marketQuestion || 'Unknown Market'}
                        </a>
                        <div className={`outcome-badge ${h.outcomeName?.toLowerCase()}`}>
                            {h.outcomeName || 'Unknown'}
                        </div>
                        <div className="holding-stats">
                            <div className="stat">
                                <span className="stat-label">Shares</span>
                                <span className="stat-value shares">{h.shares.toFixed(2)}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Avg Price</span>
                                <span className="stat-value avg-price">
                                    {((h.avgPrice || 0) * CENTS_PER_DOLLAR).toFixed(1)}¢
                                </span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Current</span>
                                <span className="stat-value current-price">
                                    {((h.currentPrice || 0) * CENTS_PER_DOLLAR).toFixed(1)}¢
                                </span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Value</span>
                                <span className="stat-value value">${(h.currentValue || 0).toFixed(2)}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">P/L</span>
                                <span className={`stat-value ${isPositive ? 'positive' : 'negative'}`}>
                                    {isPositive ? '+' : ''}${profit.toFixed(2)} ({isPositive ? '+' : ''}
                                    {(h.profitPercent || 0).toFixed(1)}%)
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
