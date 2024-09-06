from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    # TokenVerifyView
)
from django.urls import path
from olandinvestmentsapi.views import (
    LogoutView,
    UserInfoView
)

urlpatterns = [
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='token_logout'),
    path('api/auth/user-info/', UserInfoView.as_view(), name='user_info'),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
