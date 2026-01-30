from django.urls import path
from .views import StockSummaryView, StockDetailsView, StockSearchView

urlpatterns = [
    path('summary/', StockSummaryView.as_view(), name='stock-summary'),
    path('details/<str:symbol>/', StockDetailsView.as_view(), name='stock-details'),
    path('search/', StockSearchView.as_view(), name='stock-search'),
]
