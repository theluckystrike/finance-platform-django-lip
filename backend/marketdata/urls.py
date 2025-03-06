from django.urls import include, path
from rest_framework import routers
from marketdata.views import OHLCViewSet, TickerSymbolViewSet


router = routers.DefaultRouter(trailing_slash=False)
router.register(r'ohlc/?$', OHLCViewSet, basename="ohlc")
router.register(r'tickers/?$', TickerSymbolViewSet, basename="tickers")

urlpatterns = [
    path('', include(router.urls)),
]
