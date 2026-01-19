import { PERCENTAGE_MULTIPLIER, INITIAL_BALANCE } from '@/utils/constants';

interface StatsProps {
    balance: number;
    invested: number;
    portfolioValue: number;
}

export default function Stats({ balance, invested, portfolioValue }: StatsProps) {
    const totalEquity = balance + portfolioValue;
    const totalProfit = totalEquity - INITIAL_BALANCE;
    const totalProfitPercent = (totalProfit / INITIAL_BALANCE) * PERCENTAGE_MULTIPLIER;
    const isPositive = totalProfit >= 0;

    const formatMoney = (val: number) =>
        val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="stats-row">
            <div className="stat-card">
                <span className="stat-card-label">Cash Balance</span>
                <span className="stat-card-value balance">${formatMoney(balance)}</span>
            </div>
            <div className="stat-card">
                <span className="stat-card-label">Total Invested</span>
                <span className="stat-card-value invested">${formatMoney(invested)}</span>
            </div>
            <div className="stat-card">
                <span className="stat-card-label">Portfolio Value</span>
                <span className="stat-card-value portfolio">${formatMoney(portfolioValue)}</span>
            </div>
            <div className="stat-card">
                <span className="stat-card-label">Total P/L</span>
                <span className={`stat-card-value ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}${formatMoney(totalProfit)} ({isPositive ? '+' : ''}
                    {totalProfitPercent.toFixed(1)}%)
                </span>
            </div>
        </div>
    );
}
