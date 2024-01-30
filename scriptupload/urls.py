"""
Configuration for different URLs that are used by the application.

Each URL is connected to a view (like a page) in the views file.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_script, name="uploadScript"),
    # reports
    path('generate-report/<int:categoryid>/', views.generate_category_report, name="generate_category_report"),
    path('reports/custom-report/', views.custom_report_page, name="custom_report"),
    path('reports/', views.reports_page, name="reports"),
    path('reports/<str:reportname>/', views.report_page, name="report"),
    path('reports/delete-task/<int:taskid>/', views.delete_task, name="delete_task"),
    path('reports/delete/<int:reportid>/', views.delete_report, name="delete_report"),
    path('reports/update/<int:reportid>/', views.update_report, name="update_report"),
    path('save-custom-report/', views.save_custom_report, name="save_custom_report"),
    # scripts
    path('scripts/view/<str:scriptname>/', views.script_page, name="script"),
    path('scripts/view/<str:scriptname>/edit/', views.script_edit_page, name="script_edit"),
    path('scripts/view/<str:scriptname>/run/', views.run_script_code, name="run_script"),
    path('scripts/view/<str:scriptname>/delete/', views.delete_script, name="delete_script"),
    path('all-scripts/', views.all_script_page, name="all_scripts"),
    path('script-search/', views.script_search, name="script_search"),
    path('scripts/<pk>/change-index/', views.change_script_category_index, name="script_change_index"),
    path('scripts/<int:scriptid>/get-status/', views.get_script_status, name="script_status"),
    # categories
    path('categories/<str:categoryname>/', views.category_page, name="category"),
    path('categories/get-subcategories/<int:categoryid>/', views.get_subcategories, name="get_subcategories"),
    path('create-category/', views.create_category, name="create_category"),
    path('manage-categories/', views.category_manager_page, name="manage_categories"),
    path('manage-categories/update/<pk>/', views.update_category, name="update_category"),
]