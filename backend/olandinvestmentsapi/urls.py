from . import  views
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
    ScriptViewSet,
    CategoryViewSet,
    ReportViewSet,
    ReportStatusView,
    ReportUpdateView,
    SearchView
)
from rest_framework import routers

router = routers.DefaultRouter(trailing_slash=False)
router.register('scripts', views.ScriptViewSet, basename='scripts')
router.register('categories', views.CategoryViewSet, basename='categories')
router.register('reports', views.ReportViewSet, basename='reports')

urlpatterns = [
    path('api/auth/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh-token', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout', LogoutView.as_view(), name='token_logout'),
    path('api/auth/user-info', UserInfoView.as_view(), name='user_info'),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # Router urls
    path('api/', include(router.urls)),
    # Script Views
    path('api/scripts/<int:pk>/status', views.ScriptStatusView.as_view(), name='script_status'),
    path('api/scripts/<int:pk>/run', views.ScriptRunView.as_view(), name='script_run'),
    # Categories
    # Search
    path('api/search', views.SearchView.as_view(), name='search'),
    # Reports
    path('api/reports/<int:pk>/status', views.ReportStatusView.as_view(), name='report_status'),
    path('api/reports/<int:pk>/update', views.ReportUpdateView.as_view(), name='report_update'),
]
