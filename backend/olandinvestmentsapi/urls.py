from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    # TokenVerifyView
)
from django.urls import path, include
from olandinvestmentsapi.views import (
    LogoutView,
    UserInfoView,
    ScriptStatusView,
    ScriptRunView,
    ScriptViewSet
)
from rest_framework import routers

router = routers.DefaultRouter(trailing_slash=False)
router.register('scripts', ScriptViewSet, basename='scripts')

urlpatterns = [
    path('api/auth/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh-token', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout', LogoutView.as_view(), name='token_logout'),
    path('api/auth/user-info', UserInfoView.as_view(), name='user_info'),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # Script Views
    path('api/', include(router.urls)),
    path('api/scripts/<int:pk>/status', ScriptStatusView.as_view(), name='script_status'),
    path('api/scripts/<int:pk>/run', ScriptRunView.as_view(), name='script_run'),
]
