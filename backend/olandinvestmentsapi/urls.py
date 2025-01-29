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
    CategoryTreeView,
    ReportViewSet,
    ReportStatusView,
    ReportUpdateView,
    MergeReportsView,
    ReportEmailTaskViewSet,
    SummaryViewSet,
    SummaryUpdateView,
    SummaryStatusView,
    SearchView, RemoveScriptFromReport, SummaryPatchUpdateView
)
from rest_framework import routers

router = routers.DefaultRouter(trailing_slash=False)
router.register('scripts', ScriptViewSet, basename='scripts')
router.register('categories', CategoryViewSet, basename='categories')
router.register('reports/schedules', ReportEmailTaskViewSet, basename='report-schedules')
router.register('reports', ReportViewSet, basename='reports')
router.register('summaries', SummaryViewSet, basename='summaries')

urlpatterns = [
    # api routes
    path('auth/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh-token', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout', LogoutView.as_view(), name='token_logout'),
    path('auth/user-info', UserInfoView.as_view(), name='user_detail'),
    # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # Script Views
    path('scripts/<int:pk>/status', ScriptStatusView.as_view(), name='script_status'),
    path('scripts/<int:pk>/run', ScriptRunView.as_view(), name='script_run'),
    # Categories
    path('categories/tree', CategoryTreeView.as_view(), name='category_tree'),
    # Search
    path('search', SearchView.as_view(), name='search'),
    # Reports
    path('reports/<int:pk>/status', ReportStatusView.as_view(), name='report_status'),
    path('reports/<int:pk>/update', ReportUpdateView.as_view(), name='report_update'),
    path('reports/merge',
         MergeReportsView.as_view(), name='reports_merge'),
    path('reports/<int:report_id>/remove-script/<int:script_id>',
         RemoveScriptFromReport.as_view(), name="report_remove_script"),
    # Summaries
    path('summaries/<int:pk>/status', SummaryStatusView.as_view(), name='summary_status'),
    path('summaries/<int:pk>/update',
         SummaryUpdateView.as_view(), name='summary_update'),
    path('summaries/<int:pk>/edit', SummaryPatchUpdateView.as_view(), name='summary-patch-update'),

    # Router urls
    path('', include(router.urls)),

]
