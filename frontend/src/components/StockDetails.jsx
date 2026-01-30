import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStockDetails } from '../api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ComposedChart, Bar, AreaChart, Area
} from 'recharts';
import { ArrowLeft, Calendar, Info } from 'lucide-react';

const StockDetails = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('1y');

    const periods = [
        { label: '1M', value: '1mo' },
        { label: '3M', value: '3mo' },
        { label: '6M', value: '6mo' },
        { label: '1Y', value: '1y' },
        { label: '2Y', value: '2y' },
        { label: '5Y', value: '5y' },
    ];

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const res = await getStockDetails(symbol, period);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [symbol, period]);

    if (loading) return <div className="container">Loading chart data...</div>;
    if (!data) return <div className="container">Stock not found.</div>;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</p>
                    <p style={{ fontWeight: 700, fontSize: '1.25rem' }}>₹{payload[0].value}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                        <span>O: ₹{payload[0].payload.open}</span>
                        <span>H: ₹{payload[0].payload.high}</span>
                        <span>L: ₹{payload[0].payload.low}</span>
                        <span>C: ₹{payload[0].payload.close}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container">
            <button
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                style={{ marginBottom: '2rem' }}
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </button>

            <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{data.name}</h1>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.symbol}</span>
                            <span>•</span>
                            <span>NSE / India</span>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                        {periods.map(p => (
                            <button
                                key={p.value}
                                onClick={() => setPeriod(p.value)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: period === p.value ? 'var(--accent-blue)' : 'transparent',
                                    color: period === p.value ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ height: '500px', width: '100%', marginTop: '2rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.history}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="time"
                                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => val.split(' ')[0]}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                orientation="right"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="close"
                                stroke="var(--accent-blue)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Current Price</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{data.history[data.history.length - 1].close}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Period High</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{Math.max(...data.history.map(d => d.high)).toFixed(2)}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Period Low</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{Math.min(...data.history.map(d => d.low)).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockDetails;
