import { useState } from 'react';
import { usePortfolio } from './hooks/usePortfolio';
import Stats from './components/Stats';
import Holdings from './components/Holdings';
import History from './components/History';

export default function App() {
    const [activeTab, setActiveTab] = useState<'holdings' | 'history'>('holdings');
    const { balance, invested, portfolioValue, holdings, loading, refresh } = usePortfolio();

    return (
        <>
            <header>
                <div className="header-content">
                    <div className="header-left">
                        <h1>DemoMarket</h1>
                        <span className="subtitle">PolyMarket paper trading simulator</span>
                    </div>
                    <button onClick={refresh} className="refresh-btn" title="Refresh Data">
                        Refresh
                    </button>
                </div>
            </header>

            <Stats balance={balance} invested={invested} portfolioValue={portfolioValue} />

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'holdings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('holdings')}
                >
                    Holdings
                </button>
                <button
                    className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Action History
                </button>
            </div>

            <section className={`tab-content ${activeTab === 'holdings' ? 'active' : ''}`}>
                <Holdings holdings={holdings} loading={loading} />
            </section>

            <section className={`tab-content ${activeTab === 'history' ? 'active' : ''}`}>
                <History isActive={activeTab === 'history'} />
            </section>
        </>
    );
}
