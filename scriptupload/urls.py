from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_script, name="uploadScript"),
    path('scripts/<str:scriptname>/', views.script_page, name="script"),
    path('generate-report/<int:categoryid>/', views.generate_report, name="generate_report"),
    path('scripts/<str:scriptname>/edit/', views.script_edit_page, name="script_edit"),
    path('categories/<str:categoryname>/', views.category_page, name="category"),
    path('create-category/', views.create_category, name="create_category"),
    path('script-search/', views.script_search, name="script_search"),
    path('script-delete-category/<int:scriptid>/<str:categoryid>/', views.script_delete_category, name="script_delete_category"),
    path('script-add-category/<int:scriptid>/', views.script_add_category, name="script_add_category"),
]