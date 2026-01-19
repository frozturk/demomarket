import { Market, WalletHolding } from '@/types';

export interface Holding extends WalletHolding {
    tokenId: string;
    // Calculated fields
    currentPrice?: number;
    currentValue?: number;
    profit?: number;
    profitPercent?: number;
    avgPrice?: number;
    eventTitle?: string;
    marketQuestion?: string;
    outcomeName?: string;
    eventUrl?: string;
    marketUrl?: string;
    market?: Market | null; // For reference
}
