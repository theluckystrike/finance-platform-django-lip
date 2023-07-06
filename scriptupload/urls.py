from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_script, name="uploadScript"),
    path('scripts/<str:scriptname>/', views.script_page, name="script"),
    path('create-category/', views.create_category, name="create_category"),
    path('script-search/', views.script_search, name="script_search"),
    path('script-delete-category/<int:scriptid>/<str:categoryname>/', views.script_edit_category, name="script_delete_category"),
    path('script-add-category/<int:scriptid>/<str:categoryname>/', views.script_edit_category, name="script_add_category"),
]