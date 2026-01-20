import { EventData } from '@/types';

export async function getEventDataBySlug(eventSlug: string): Promise<EventData> {
    const cacheKey = `event_slug_${eventSlug}`;
    const cached = await chrome.storage.local.get([cacheKey]);
    if (cached[cacheKey]) {
        return cached[cacheKey] as EventData;
    }

    const res = await fetch(`https://gamma-api.polymarket.com/events/slug/${eventSlug}`);
    const data = await res.json();

    const eventData: EventData = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        markets:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.markets?.map((m: any) => ({
                id: m.id,
                slug: m.slug,
                question: m.question,
                groupItemTitle: m.groupItemTitle,
                outcomes: m.outcomes,
                clobTokenIds: m.clobTokenIds,
            })) || [],
    };

    await chrome.storage.local.set({ [cacheKey]: eventData });
    return eventData;
}

export async function getTokenPrice(tokenId: string, side: string = 'SELL'): Promise<number> {
    const marketSide = side === 'SELL' ? 'BUY' : 'SELL';
    const res = await fetch(`https://clob.polymarket.com/price?token_id=${tokenId}&side=${marketSide}`);
    if (!res.ok) {
        return -1;
    }
    const data = await res.json();
    return parseFloat(data.price);
}

export async function getOutcomePrice(tokenId: string): Promise<number> {
    const market = await fetch(`https://gamma-api.polymarket.com/markets?clob_token_ids=${tokenId}`);
    const data = await market.json();
    const clobTokenIds = JSON.parse(data[0].clobTokenIds);
    const tokenIndex = clobTokenIds.indexOf(tokenId);
    const outcomePrices = JSON.parse(data[0].outcomePrices);
    return parseFloat(outcomePrices[tokenIndex]);
}
