from django.urls import include, path
from rest_framework import routers
from .views import OHLCViewSet, UserViewSet, IndexActionViewSet, IndexConstituentViewSet, RateViewSet, StockExchangeDataViewSet

router = routers.DefaultRouter()
router.register(r'ohlcdata', OHLCViewSet, basename="ohlcdata")
router.register(r'indexconstituents', IndexConstituentViewSet,
                basename="indexconstituents")
router.register(r'indexactions', IndexActionViewSet, basename="indexactions")
router.register(r'rates', RateViewSet, basename="rates")
router.register(r'exchanges', StockExchangeDataViewSet, basename="exchanges")
router.register(r'users', UserViewSet)
# router.register(r'groups', views.GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
