export interface Market {
    id: string;
    slug: string;
    question: string;
    groupItemTitle?: string;
    outcomes: string[];
    clobTokenIds: string[];
}

export interface EventData {
    id: string;
    title: string;
    slug: string;
    markets: Market[];
}

export interface WalletEntry {
    version: number;
    eventSlug: string;
    marketSlug: string;
    clobTokenId: string;
    side: string;
    price: number;
    amount: number;
    shares: number;
    totalValue: number;
    remainingBalance: number;
    timestamp: number;
}

export interface WalletHolding {
    shares: number;
    totalCost: number;
    eventSlug: string;
    marketSlug: string;
}

export interface Wallet {
    [tokenId: string]: WalletHolding;
}
