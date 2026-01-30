import yfinance as yf
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta

class StockSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
        
        # Simple search using yfinance Tickers or just manual logic
        # For a more robust search, one might use a public API or a static list
        # For now, we'll try to validate if the query looks like a ticker
        try:
            # We add .NS for NSE by default if no suffix
            if not (query.endswith('.NS') or query.endswith('.BO')):
                symbol = f"{query.upper()}.NS"
            else:
                symbol = query.upper()
                
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            if 'shortName' in info:
                return Response([{
                    'symbol': symbol,
                    'name': info.get('shortName', ''),
                    'type': 'Stock'
                }])
        except:
            pass
            
        return Response([])

class StockSummaryView(APIView):
    def post(self, request):
        symbols = request.data.get('symbols', [])
        if not symbols:
            return Response({"error": "No symbols provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        results = []
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                # Fetch 2 years of data to calculate all intervals
                hist = ticker.history(period="2y")
                
                if hist.empty:
                    continue
                
                current_price = hist['Close'].iloc[-1]
                
                def get_stats(days_ago):
                    # Find the closest date to 'days_ago' in the history
                    target_date = hist.index[-1] - timedelta(days=days_ago)
                    sub_hist = hist[hist.index >= target_date]
                    
                    if sub_hist.empty:
                        return None, None, None
                    
                    price_then = sub_hist['Close'].iloc[0]
                    pct_change = ((current_price - price_then) / price_then) * 100
                    min_price = sub_hist['Low'].min()
                    max_price = sub_hist['High'].max()
                    
                    return round(pct_change, 2), round(min_price, 2), round(max_price, 2)

                intervals = {
                    '1d': 1, '2d': 2, '3d': 3, '4d': 4, '5d': 5,
                    '1w': 7, '2w': 14, '3w': 21, '4w': 28,
                    '1m': 30, '2m': 60, '3m': 90, '4m': 120, '5m': 150, '6m': 180,
                    '1y': 365, '2y': 730
                }
                
                stock_data = {
                    'symbol': symbol,
                    'name': ticker.info.get('shortName', symbol),
                    'current_price': round(current_price, 2),
                }
                
                # Fill in intervals
                for label, days in intervals.items():
                    pct, low, high = get_stats(days)
                    stock_data[label] = {
                        'pct': pct,
                        'range': f"{low} - {high}" if low and high else "N/A"
                    }
                
                results.append(stock_data)
            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
                continue
                
        return Response(results)

class StockDetailsView(APIView):
    def get(self, request, symbol):
        period = request.query_params.get('period', '1y')
        interval = request.query_params.get('interval', '1d')
        
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=interval)
            
            if hist.empty:
                return Response({"error": "No data found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Formatting for charts
            data = []
            for index, row in hist.iterrows():
                data.append({
                    'time': index.strftime('%Y-%m-%d %H:%M:%S'),
                    'open': round(row['Open'], 2),
                    'high': round(row['High'], 2),
                    'low': round(row['Low'], 2),
                    'close': round(row['Close'], 2),
                    'volume': int(row['Volume']),
                })
                
            return Response({
                'symbol': symbol,
                'name': ticker.info.get('shortName', symbol),
                'history': data
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
