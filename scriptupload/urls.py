from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('scripts/<str:scriptname>/', views.script, name="script"),
]