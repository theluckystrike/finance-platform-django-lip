from django.urls import include, path, re_path
from rest_framework import routers
from .views import OHLCViewSet, IndexActionViewSet, IndexConstituentViewSet, RateViewSet, StockExchangeDataViewSet, ScriptTableDataRetrieveView, BlackRockXDGDataViewSet, BlackRockXEGDataViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'ohlcdata/?$', OHLCViewSet, basename="ohlcdata")
router.register(r'indexconstituents/?$', IndexConstituentViewSet,
                basename="indexconstituents")
router.register(r'indexactions/?$', IndexActionViewSet,
                basename="indexactions")
router.register(r'rates/?$', RateViewSet, basename="rates")
router.register(r'exchanges/?$', StockExchangeDataViewSet,
                basename="exchanges")
router.register(r'blackrock/xdg/?$', BlackRockXDGDataViewSet,
                basename="blackrockxdg")
router.register(r'blackrock/xeg/?$', BlackRockXEGDataViewSet,
                basename="blackrockxeg")

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    re_path(r'^scripttabledata/(?P<id>\d+)/?$', ScriptTableDataRetrieveView.as_view(), name='scripttabledata-detail'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
