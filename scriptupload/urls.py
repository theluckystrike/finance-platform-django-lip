"""
Configuration for different URLs that are used by the application.

Each URL is connected to a view (like a page) in the views file.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_script, name="uploadScript"),
    path('scripts/<str:scriptname>/', views.script_page, name="script"),
    path('generate-report/<int:categoryid>/', views.generate_category_report, name="generate_category_report"),
    path('custom-report/', views.custom_report_page, name="custom_report"),
    path('reports/', views.reports_page, name="reports"),
    path('reports/<str:reportname>/', views.report_page, name="report"),
    path('reports/delete-task/<int:taskid>/', views.delete_task, name="delete_task"),
    path('reports/delete/<int:reportid>/', views.delete_report, name="delete_report"),
    path('reports/update/<int:reportid>/', views.update_report, name="update_report"),
    path('save-custom-report/', views.save_custom_report, name="save_custom_report"),
    path('scripts/<str:scriptname>/edit/', views.script_edit_page, name="script_edit"),
    path('scripts/<str:scriptname>/run/', views.run_script_code, name="run_script"),
    path('scripts/<str:scriptname>/delete/', views.delete_script, name="delete_script"),
    path('all-scripts/', views.all_script_page, name="all_scripts"),
    path('categories/<str:categoryname>/', views.category_page, name="category"),
    path('create-category/', views.create_category, name="create_category"),
    path('script-search/', views.script_search, name="script_search"),
    path('script-delete-category/<int:scriptid>/<str:categoryid>/', views.script_delete_category, name="script_delete_category"),
    path('script-add-category/<int:scriptid>/', views.script_add_category, name="script_add_category"),
]