from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_script, name="uploadScript"),
    path('scripts/<str:scriptname>/', views.script, name="script"),
    path('create-category/', views.create_category, name="create_category"),
    path('script-search/', views.script_search, name="script_search"),
]