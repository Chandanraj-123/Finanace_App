import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const searchStocks = (query) => api.get(`/search/?q=${query}`);
export const getStockSummary = (symbols) => api.post('/summary/', { symbols });
export const getStockDetails = (symbol, period = '1y', interval = '1d') =>
    api.get(`/details/${symbol}/?period=${period}&interval=${interval}`);

export default api;
