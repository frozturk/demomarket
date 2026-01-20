import { WalletEntry, Market } from '@/types';
import { getMarketByName } from '@/utils';
import { getEventDataBySlug, getTokenPrice } from '@/services/polymarket';
import { DATA_VERSION } from '@/utils/constants';
import { processWalletEntry } from './wallet';
import { TradeFormData } from './ui';

export interface TradeInput {
    eventSlug: string;
    formData: TradeFormData;
}

function getClobTokenId(market: Market, outcomeIndex: number): string {
    return market.clobTokenIds[outcomeIndex];
}

export async function executeTrade(input: TradeInput): Promise<boolean> {
    const eventData = await getEventDataBySlug(input.eventSlug);
    const currentMarket = getMarketByName(eventData, input.formData.marketName);
    if (!currentMarket) return false;

    const clobTokenId = getClobTokenId(currentMarket, input.formData.selectedOutcomeIndex);
    const marketSide = input.formData.side === 'BUY' ? 'SELL' : 'BUY';
    const price = await getTokenPrice(clobTokenId, marketSide);

    if (!price || !isFinite(price)) {
        return false;
    }

    const walletEntry: WalletEntry = {
        version: DATA_VERSION,
        eventSlug: input.eventSlug,
        marketSlug: currentMarket.slug,
        clobTokenId,
        side: input.formData.side,
        price,
        amount: input.formData.amount,
        shares: 0,
        totalValue: 0,
        remainingBalance: 0,
        timestamp: 0,
    };

    return processWalletEntry(walletEntry);
}
