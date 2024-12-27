from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Oland Investments API",
        default_version='v2',
        description="Full API reference documentation for the Oland Investments platform",
        terms_of_service="https://www.google.com/policies/terms/",
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    patterns=[
        path('', include('olandinvestmentsapi.urls')),
        path('', include('databaseinterface.urls')),
    ]
)

urlpatterns = [
    path('', include('olandinvestmentsapi.urls')),
    path('', include('databaseinterface.urls')),
    path('documentation/', schema_view.with_ui('swagger',
         cache_timeout=0), name='schema-swagger-ui'),
]
