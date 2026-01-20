export const SELECTORS = {
    TRADE_WIDGET: '#trade-widget',
    OUTCOME_BUTTONS: '#outcome-buttons',
    AMOUNT_INPUT: '#market-order-amount-input',
    ACTION_AREA: 'div.flex.flex-col.gap-4 > div.flex.flex-1',
    MARKET_ELEMENT: '#trade-widget span.font-semibold.text-base',
    SELECTED_RADIO_BUTTON: 'button[aria-checked=true]',
    RADIO_BUTTONS: '#trade-widget div[role=radiogroup]',
} as const;

export const URL_PATTERNS = {
    POLYMARKET_EVENT: 'https://polymarket.com/event/',
} as const;
