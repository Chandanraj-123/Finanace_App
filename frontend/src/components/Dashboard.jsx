import React, { useState, useEffect } from 'react';
import { getStockSummary, searchStocks } from '../api';
import { Search, RefreshCw, ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState(() => {
        const saved = localStorage.getItem('watchlist');
        return saved ? JSON.parse(saved) : ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS'];
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    const intervals = ['1d', '5d', '1w', '1m', '6m', '1y']; // Simplified for display space, but logic handles all

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getStockSummary(watchlist);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [watchlist]);

    const handleSearch = async (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        if (q.length > 2) {
            try {
                const res = await searchStocks(q);
                setSearchResults(res.data);
            } catch (err) {
                console.error(err);
            }
        } else {
            setSearchResults([]);
        }
    };

    const addToWatchlist = (symbol) => {
        if (!watchlist.includes(symbol)) {
            const newWatchlist = [...watchlist, symbol];
            setWatchlist(newWatchlist);
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeFromWatchlist = (symbol) => {
        const newWatchlist = watchlist.filter(s => s !== symbol);
        setWatchlist(newWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle deep access for intervals
        if (intervals.includes(sortConfig.key)) {
            aVal = a[sortConfig.key]?.pct || 0;
            bVal = b[sortConfig.key]?.pct || 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="container">
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="Search Indian Stocks (e.g. TATAMOTORS)..."
                                value={searchQuery}
                                onChange={handleSearch}
                                style={{ width: '100%' }}
                            />
                            <button className="btn btn-primary">
                                <Search size={18} />
                            </button>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="glass-card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, marginTop: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                                {searchResults.map(res => (
                                    <div
                                        key={res.symbol}
                                        className="search-item"
                                        onClick={() => addToWatchlist(res.symbol)}
                                        style={{ padding: '1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}
                                    >
                                        <span>{res.name} (<strong>{res.symbol}</strong>)</span>
                                        <Plus size={16} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('name')}>Company</th>
                                <th>Price</th>
                                {intervals.map(interval => (
                                    <th key={interval} onClick={() => requestSort(interval)}>
                                        {interval.toUpperCase()} %
                                    </th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map(stock => (
                                <tr key={stock.symbol}>
                                    <td
                                        onClick={() => navigate(`/stock/${stock.symbol}`)}
                                        style={{ cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        <div>{stock.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stock.symbol}</div>
                                    </td>
                                    <td>₹{stock.current_price}</td>
                                    {intervals.map(interval => {
                                        const pct = stock[interval]?.pct;
                                        const range = stock[interval]?.range;
                                        return (
                                            <td key={interval}>
                                                <span className={pct >= 0 ? 'positive' : 'negative'}>
                                                    {pct > 0 ? '+' : ''}{pct}%
                                                </span>
                                                <span className="price-range">Range: {range}</span>
                                            </td>
                                        );
                                    })}
                                    <td>
                                        <button
                                            className="btn"
                                            style={{ color: 'var(--accent-red)', padding: '0.25rem' }}
                                            onClick={() => removeFromWatchlist(stock.symbol)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
