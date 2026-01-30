# NiftyScope - Indian Stocks Analysis Dashboard

NiftyScope is a premium full-stack web application designed for analyzing Indian stock market data. It provides real-time performance tracking across multiple time intervals, interactive charting, and a personalized watchlist feature.

## 🚀 Features

- **Real-time Performance Metrics**: View percentage changes and price ranges (H/L) for 1D, 5D, 1W, 1M, 6M, and 1Y.
- **Interactive Visualizations**: Detailed stock analysis using interactive Area Charts powered by Recharts.
- **Custom Watchlist**: Save and manage your favorite stocks using persistent local storage.
- **Global Search**: Search for any Indian stock (NSE/BSE) and add it to your dashboard.
- **Premium UI/UX**: Modern dark-themed design with glassmorphism effects and smooth transitions.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Recharts, Lucide React, Vanilla CSS.
- **Backend**: Django, Django REST Framework, `yfinance`.
- **Data Source**: Yahoo Finance API (via `yfinance`).

## � Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js & npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers yfinance pandas
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📸 Screenshots

- **Dashboard**: A comprehensive table showing performance stats for multiple stocks.
- **Details Page**: Interactive historical charts for selected stocks.
- **Search**: Intuitive search results for adding new tickers.

## 📄 License

This project is licensed under the MIT License.
