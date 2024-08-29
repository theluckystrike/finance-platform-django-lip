from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    # TokenVerifyView
)
from django.urls import path

urlpatterns = [
    path('api/auth/login/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/auth/refresh-token/',
         TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

]
