import { useState, useEffect, useCallback } from 'react';
import { type Wallet } from '@/types';
import { getMarketDataBySlug, getOutcomeName } from '@/utils';
import { getEventDataBySlug, getOutcomePrice, getTokenPrice } from '@/services/polymarket';
import { INITIAL_BALANCE, PERCENTAGE_MULTIPLIER } from '@/utils/constants';
import { Holding } from '../types';

interface PortfolioState {
    balance: number;
    invested: number;
    portfolioValue: number;
    holdings: Holding[];
    loading: boolean;
}

async function enrichHolding(tokenId: string, holding: Wallet[string]): Promise<Holding> {
    const [tokenPrice, eventData] = await Promise.all([
        getTokenPrice(tokenId, 'SELL'),
        getEventDataBySlug(holding.eventSlug),
    ]);

    let currentPrice = tokenPrice;
    if (tokenPrice < 0) {
        currentPrice = await getOutcomePrice(tokenId);
    }

    const market = getMarketDataBySlug(eventData, holding.marketSlug);
    const currentVal = holding.shares * currentPrice;
    const costBasis = holding.totalCost;

    console.log('currentPrice', currentPrice);
    console.log('currentVal', currentVal);
    console.log('costBasis', costBasis);

    return {
        tokenId,
        ...holding,
        currentPrice,
        currentValue: currentVal,
        profit: currentVal - costBasis,
        profitPercent: ((currentVal - costBasis) / costBasis) * PERCENTAGE_MULTIPLIER,
        avgPrice: holding.totalCost / holding.shares,
        eventTitle: eventData.title || 'Unknown Event',
        marketQuestion: market?.question || 'Unknown Market',
        outcomeName: getOutcomeName(market, tokenId),
        eventUrl: `https://polymarket.com/event/${eventData.slug || ''}`,
        marketUrl: `https://polymarket.com/event/${eventData.slug || ''}${market?.slug ? '/' + market.slug : ''}`,
    };
}

export function usePortfolio(): PortfolioState & { refresh: () => void } {
    const [state, setState] = useState<PortfolioState>({
        balance: INITIAL_BALANCE,
        invested: 0,
        portfolioValue: 0,
        holdings: [],
        loading: true,
    });

    const loadData = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true }));

        const data = await chrome.storage.local.get(['balance', 'wallet']);
        const balance = typeof data.balance === 'number' ? data.balance : INITIAL_BALANCE;
        const wallet = (data.wallet || {}) as Wallet;
        const tokenIds = Object.keys(wallet).filter((id) => wallet[id].shares > 0);

        if (tokenIds.length === 0) {
            setState({ balance, invested: 0, portfolioValue: 0, holdings: [], loading: false });
            return;
        }

        const enrichedHoldings = await Promise.all(
            tokenIds.map(async (tokenId) => {
                try {
                    return await enrichHolding(tokenId, wallet[tokenId]);
                } catch (e) {
                    console.error('Error fetching holding data:', e);
                    return {
                        tokenId,
                        ...wallet[tokenId],
                        currentValue: 0,
                        eventTitle: 'Error loading',
                        marketQuestion: 'Unable to load market data',
                        outcomeName: 'Unknown',
                    } as Holding;
                }
            })
        );

        enrichedHoldings.sort((a, b) => (b.currentValue || 0) - (a.currentValue || 0));

        const invested = enrichedHoldings.reduce((sum, h) => sum + h.totalCost, 0);
        const portfolioValue = enrichedHoldings.reduce((sum, h) => sum + (h.currentValue || 0), 0);

        setState({ balance, invested, portfolioValue, holdings: enrichedHoldings, loading: false });
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { ...state, refresh: loadData };
}
