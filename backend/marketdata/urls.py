from django.urls import include, path
from rest_framework import routers
from marketdata.views import OHLCViewSet, TickerSymbolViewSet


router = routers.DefaultRouter(trailing_slash=False)
router.register(r'marketdata/ohlc/?$', OHLCViewSet, basename="ohlc")
router.register(r'marketdata/tickers/?$', TickerSymbolViewSet, basename="tickers")

urlpatterns = [
    path('', include(router.urls)),
]
