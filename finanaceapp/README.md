# NiftyScope: Indian Stocks Analysis Dashboard

A premium, full-stack dashboard for analyzing Indian stocks with real-time-like performance tracking, interactive charts, and a custom watchlist.

## 🚀 Features

- **Multi-Interval Performance**: Track stock percentage changes and price ranges for 1D, 5D, 1W, 1M, 6M, and 1Y.
- **Interactive Charts**: Separate details page with a modern Area Chart (powered by Recharts) for historical analysis.
- **Custom Watchlist**: Save your favorite stocks to a local watchlist (persisted in Browser Local Storage).
- **Stock Search**: Find any Indian stock (NSE/BSE) using the search bar.
- **Premium Design**: Dark-themed, glassmorphism-inspired interface with smooth transitions and responsive layout.

## 🛠 Tech Stack

- **Backend**: Django, Django REST Framework, `yfinance`.
- **Frontend**: React (Vite), Axios, Recharts, Lucide React.
- **Styling**: Vanilla CSS (Custom Design System).

## 📦 Installation & Setup

### 1. Prerequisites
- Python 3.x
- Node.js & npm

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # On Windows
pip install -r requirements.txt # (Or manually install: django djangorestframework django-cors-headers yfinance pandas)
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📸 Preview
*Refer to the project walkthrough for screenshots of the Dashboard and Charts.*

## 📄 License
MIT
