import { SELECTORS } from './selectors';

const COLORS = {
    DEFAULT: '#ff9400',
    SUCCESS: '#22c55e',
    ERROR: '#ef4444',
    SPINNER_BORDER: 'rgba(255,255,255,0.3)',
    SPINNER_TOP: 'white',
} as const;

const SPINNER_STYLE_ID = 'demo-spinner-style';
const SPINNER_KEYFRAMES =
    '@keyframes demo-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';

function ensureSpinnerStyle(): void {
    if (document.querySelector(`#${SPINNER_STYLE_ID}`)) return;
    const style = document.createElement('style');
    style.id = SPINNER_STYLE_ID;
    style.textContent = SPINNER_KEYFRAMES;
    document.head.appendChild(style);
}

function createSpinner(): HTMLElement {
    ensureSpinnerStyle();
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid ${COLORS.SPINNER_BORDER};
        border-top-color: ${COLORS.SPINNER_TOP};
        border-radius: 50%;
        animation: demo-spin 0.8s linear infinite;
        vertical-align: middle;
        box-sizing: border-box;
    `;
    return spinner;
}

export interface ButtonState {
    originalContent: string;
    originalBackground: string;
}

function setButtonColor(button: HTMLButtonElement, color: string): void {
    button.style.setProperty('--btn-background', color);
    button.style.setProperty('--btn-background-hover', color);
}

export function setButtonLoading(button: HTMLButtonElement): ButtonState {
    const state: ButtonState = {
        originalContent: button.innerHTML,
        originalBackground: button.style.getPropertyValue('--btn-background') || COLORS.DEFAULT,
    };
    button.innerHTML = '';
    button.appendChild(createSpinner());
    button.disabled = true;
    button.style.opacity = '0.7';
    return state;
}

export function setButtonSuccess(button: HTMLButtonElement): void {
    button.disabled = false;
    button.style.opacity = '1';
    button.innerHTML = '✓';
    setButtonColor(button, COLORS.SUCCESS);
}

export function setButtonError(button: HTMLButtonElement): void {
    button.disabled = false;
    button.style.opacity = '1';
    button.innerHTML = '✕';
    setButtonColor(button, COLORS.ERROR);
}

export function restoreButton(button: HTMLButtonElement, state: ButtonState): void {
    button.disabled = false;
    button.style.opacity = '1';
    button.innerHTML = state.originalContent;
    setButtonColor(button, state.originalBackground);
}

export function createDemoButton(tradeWidget: Element): HTMLButtonElement | null {
    const actionArea = tradeWidget.querySelector(SELECTORS.ACTION_AREA);
    if (!actionArea) return null;

    actionArea.className = actionArea.className + ' gap-3';
    const actionButtonArea = actionArea.querySelector('span');
    if (!actionButtonArea) return null;

    const newButtonArea = actionButtonArea.cloneNode(true) as HTMLElement;
    newButtonArea.style.flex = '0.3';

    const newButton = newButtonArea.querySelector('button');
    if (!newButton) return null;

    newButton.innerText = 'Demo';
    newButton.style.fontSize = '14px';
    newButton.style.fontWeight = '600';
    setButtonColor(newButton, COLORS.DEFAULT);
    newButton.addEventListener('mouseenter', () => {
        newButton.setAttribute('data-tapstate', 'hover');
    });
    newButton.addEventListener('mouseleave', () => {
        newButton.setAttribute('data-tapstate', 'rest');
    });

    actionArea.appendChild(newButtonArea);
    return newButton;
}

export function waitForElement(selector: string, callback: (el: Element) => void): void {
    const existing = document.querySelector(selector);
    if (existing) {
        callback(existing);
    }

    let foundElem = existing;
    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el && foundElem !== el) {
            foundElem = el;
            callback(el);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
}

export interface TradeFormData {
    marketName: string;
    selectedOutcomeIndex: number;
    side: string;
    amount: number;
}

export function readTradeForm(): TradeFormData | null {
    const marketElement = document.querySelector(SELECTORS.MARKET_ELEMENT) as HTMLElement | null;
    if (!marketElement) return null;

    const outcomeButtons = document.querySelector(SELECTORS.OUTCOME_BUTTONS);
    if (!outcomeButtons) return null;

    const selectedOutcomeButton = outcomeButtons.querySelector(SELECTORS.SELECTED_OUTCOME) as HTMLButtonElement | null;
    if (!selectedOutcomeButton) return null;

    const sideElement = document.querySelector(SELECTORS.SIDE_BUTTON) as HTMLButtonElement | null;
    if (!sideElement) return null;

    const amountInput = document.querySelector(SELECTORS.AMOUNT_INPUT) as HTMLInputElement | null;
    if (!amountInput) return null;

    const value = amountInput.value.replace('$', '').replace(',', '');
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) return null;

    return {
        marketName: marketElement.innerText,
        selectedOutcomeIndex: parseInt(selectedOutcomeButton.value),
        side: sideElement.value,
        amount,
    };
}
