from django.urls import include, path

urlpatterns = [
    path('', include('olandinvestmentsapi.urls')),
    path('', include('databaseinterface.urls')),
]
