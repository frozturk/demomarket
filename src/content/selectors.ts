export const SELECTORS = {
    TRADE_WIDGET: '#trade-widget',
    OUTCOME_BUTTONS: '#outcome-buttons',
    AMOUNT_INPUT: '#market-order-amount-input',
    ACTION_AREA: 'div > div:nth-child(1) > div:nth-child(3) > div:nth-child(2)',
    MARKET_ELEMENT: '#trade-widget > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)',
    SIDE_BUTTON:
        '#trade-widget > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button[aria-checked=true]',
    SELECTED_OUTCOME: 'button[aria-checked=true]',
} as const;

export const URL_PATTERNS = {
    POLYMARKET_EVENT: 'https://polymarket.com/event/',
} as const;
