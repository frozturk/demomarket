import { SELECTORS, URL_PATTERNS } from './selectors';
import {
    createDemoButton,
    waitForElement,
    setButtonLoading,
    setButtonSuccess,
    setButtonError,
    restoreButton,
    readTradeForm,
} from './ui';
import { loadState } from './wallet';
import { executeTrade } from './trading';

const FEEDBACK_DELAY_MS = 500;

let isLoading = false;

async function handleDemoClick(button: HTMLButtonElement, eventSlug: string): Promise<void> {
    if (isLoading) return;

    isLoading = true;
    const buttonState = setButtonLoading(button);

    let success = false;
    try {
        await Promise.all([new Promise((r) => setTimeout(r, FEEDBACK_DELAY_MS)), loadState()]);

        const formData = readTradeForm();
        if (formData) {
            success = await executeTrade({ eventSlug, formData });
        }
    } finally {
        if (success) {
            setButtonSuccess(button);
        } else {
            setButtonError(button);
        }

        await new Promise((r) => setTimeout(r, FEEDBACK_DELAY_MS));
        restoreButton(button, buttonState);
        isLoading = false;
    }
}

function handleEventPage(tradeWidget: Element): void {
    if (!window.location.href.startsWith(URL_PATTERNS.POLYMARKET_EVENT)) {
        return;
    }

    const path = window.location.pathname;
    const eventSlug = path.split('/')[2];

    const demoButton = createDemoButton(tradeWidget);
    if (demoButton) {
        demoButton.addEventListener('click', () => handleDemoClick(demoButton, eventSlug));
    }
}

waitForElement(SELECTORS.TRADE_WIDGET, handleEventPage);
loadState();
