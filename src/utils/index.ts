import { EventData, Market } from '@/types';

export * from '@/types';

export function getMarketDataBySlug(eventData: EventData, marketSlug: string): Market | null {
    const market = eventData.markets?.find((m) => m.slug === marketSlug);
    if (!market) return null;

    return {
        id: market.id,
        slug: market.slug || '',
        question: market.question || market.groupItemTitle || 'Unknown Market',
        outcomes: typeof market.outcomes === 'string' ? JSON.parse(market.outcomes) : market.outcomes,
        clobTokenIds: typeof market.clobTokenIds === 'string' ? JSON.parse(market.clobTokenIds) : market.clobTokenIds,
    };
}

export function getMarketByName(eventData: EventData, marketName: string): Market | null {
    const market = eventData.markets?.find((m) => m.groupItemTitle === marketName || m.question === marketName);
    if (!market) return null;

    return {
        id: market.id,
        slug: market.slug || '',
        question: market.question || market.groupItemTitle || 'Unknown Market',
        outcomes: typeof market.outcomes === 'string' ? JSON.parse(market.outcomes) : market.outcomes,
        clobTokenIds: typeof market.clobTokenIds === 'string' ? JSON.parse(market.clobTokenIds) : market.clobTokenIds,
    };
}

export function getOutcomeName(market: Market | null, tokenId: string): string {
    if (!market) return 'Unknown';
    const outcomeIndex = market.clobTokenIds.indexOf(tokenId);
    return market.outcomes[outcomeIndex] || 'Unknown';
}
