import { Wallet, WalletEntry } from '@/types';
import { INITIAL_BALANCE } from '@/utils/constants';

let balance = INITIAL_BALANCE;
let walletHistory: WalletEntry[] = [];
let wallet: Wallet = {};

export function getBalance(): number {
    return balance;
}

export function getWallet(): Wallet {
    return wallet;
}

export function getWalletHistory(): WalletEntry[] {
    return walletHistory;
}

export async function saveState(): Promise<void> {
    await chrome.storage.local.set({ balance, wallet, walletHistory });
}

export async function loadState(): Promise<void> {
    const data = await chrome.storage.local.get(['balance', 'wallet', 'walletHistory']);
    if (data.balance !== undefined) balance = data.balance as number;
    if (data.wallet) wallet = data.wallet as Wallet;
    if (data.walletHistory) walletHistory = data.walletHistory as WalletEntry[];
}

export function processWalletEntry(walletEntry: WalletEntry): boolean {
    let holding = wallet[walletEntry.clobTokenId];
    if (!holding) {
        holding = { shares: 0, totalCost: 0, eventSlug: walletEntry.eventSlug, marketSlug: walletEntry.marketSlug };
        wallet[walletEntry.clobTokenId] = holding;
    }

    if (walletEntry.side === 'BUY') {
        if (balance < walletEntry.amount) {
            return false;
        }
        balance -= walletEntry.amount;
        const shareCount = walletEntry.amount / walletEntry.price;
        holding.shares += shareCount;
        holding.totalCost += walletEntry.amount;
        walletEntry.shares = shareCount;
        walletEntry.totalValue = walletEntry.amount;
    } else {
        const shareCount = walletEntry.amount;
        if (holding.shares < shareCount) {
            return false;
        }
        const avgPrice = holding.totalCost / holding.shares;
        const costBasis = shareCount * avgPrice;
        holding.totalCost -= costBasis;
        holding.shares -= shareCount;
        const totalValue = walletEntry.amount * walletEntry.price;
        balance += totalValue;
        walletEntry.shares = shareCount;
        walletEntry.totalValue = totalValue;
    }

    walletEntry.remainingBalance = balance;
    walletEntry.timestamp = Date.now();
    walletHistory.push(walletEntry);

    saveState();
    return true;
}
