"""
Configuration for different URLs that are used by the application.

Each URL is connected to a view (like a page) in the views file.
"""

from django.urls import path
from . import views
from .views import CategoryScriptsView, GenerateCategoryReportView, UpdateCategoryView

from .views import (
    CreateCategoryView,
    DeleteCategoryView,
    GenerateCategoryReportView,
    GetSubcategoriesView,
    CategoryScriptsView,
    CategoryManagerAPIView

)


urlpatterns = [
    path('', views.upload_script, name="uploadScript"),
    # reports
    path('generate-report/<int:categoryid>/', views.generate_category_report, name="generate_category_report"),
    path('reports/custom-report/', views.custom_report_page, name="custom_report"),
    path('reports/', views.reports_page, name="reports"),
    path('reports/<str:reportname>/', views.report_page, name="report"),
    path('reports/delete-task/<int:taskid>/', views.delete_task, name="delete_task"),
    path('reports/<str:reportname>/remove-script/<int:scriptid>/', views.remove_script_from_report, name="report_remove_script"),
    path('reports/<str:reportname>/add-script/<int:scriptid>/', views.add_script_to_report, name="report_add_script"),
    path('reports/delete/<int:reportid>/', views.delete_report, name="delete_report"),
    path('reports/update/<int:reportid>/', views.update_report, name="update_report"),
    path('reports/get-status/<int:reportid>/', views.get_report_status, name="report_status"),
    path('save-custom-report/', views.save_custom_report, name="save_custom_report"),
    # scripts
    path('scripts/view/<str:scriptname>/', views.script_page, name="script"),
    path('scripts/view/<str:scriptname>/edit/', views.script_edit_page, name="script_edit"),
    path('scripts/view/<str:scriptname>/run/', views.run_script_code, name="run_script"),
    path('scripts/view/<str:scriptname>/delete/', views.delete_script, name="delete_script"),
    path('all-scripts/', views.all_script_page, name="all_scripts"),
    path('scripts/search/', views.script_search, name="script_search"),
    path('scripts/<pk>/change-index/', views.change_script_category_index, name="script_change_index"),
    path('scripts/<int:scriptid>/get-status/', views.get_script_status, name="script_status"),
    # categories
    path('categories/<str:categoryname>/', views.category_page, name="category"),
    path('categories/get-subcategories/<int:categoryid>/', views.get_subcategories, name="get_subcategories"),
    path('create-category/', views.create_category, name="create_category"),
    path('manage-categories/', views.category_manager_page, name="manage_categories"),
    path('manage-categories/update/<pk>/', views.update_category, name="update_category"),
    path('manage-categories/delete/<pk>/', views.delete_category, name="delete_category"),

    # start apis path of category sections
    # API endpoint to update a category
    path('api/category/<int:pk>/update/', views.UpdateCategoryView.as_view(), name='update-category'),
    path('category/create/', views.CreateCategoryView.as_view(), name='create_category'),
    path('category/delete/<int:pk>/', views.DeleteCategoryView.as_view(), name='delete_category'),
    path('category/report/<int:categoryid>/', views.GenerateCategoryReportView.as_view(), name='generate_category_report'),
    path('category/subcategories/<int:categoryid>/', views.GetSubcategoriesView.as_view(), name='get_subcategories'),
    path('category/scripts/<str:categoryname>/', views.CategoryScriptsView.as_view(), name='category_scripts'),
    path('category/manager/', views.CategoryManagerAPIView.as_view(), name='category_manager_api'),
    # end apis path of category sections ==============================================

    # start apis path of script sections +++++++++++++++++++++++++++++++++++++++
    path('scripts/upload/', views.UploadScriptView.as_view(), name='upload_script'),
    # URL for listing all scripts
    path('scripts/', views.ScriptListView.as_view(), name='script_list'),
    # URL for viewing a specific script's details
    path('scripts/view/<str:name>/', views.ScriptDetailView.as_view(), name='script_detail'),
    # URL for running a script
    path('scripts/run/<str:name>/', views.RunScriptView.as_view(), name='run_script'),
    # URL for getting the status of a script
    path('scripts/status/<int:scriptid>/', views.ScriptStatusView.as_view(), name='script_status'),
    # URL for deleting a script
    path('scripts/delete/<str:name>/', views.DeleteScriptView.as_view(), name='delete_script'),
    # URL for editing a script
    path('scripts/edit/<str:name>/', views.EditScriptView.as_view(), name='edit_script'),
    # URL for changing a script's category index
    path('scripts/change-category-index/<int:pk>/', views.ChangeScriptCategoryIndexView.as_view(), name='change_script_category_index'),
    # URL for searching scripts
    path('scripts/search/', views.ScriptSearchView.as_view(), name='script_search'),
    # end apis path of script sections ++++++++++++++++++++++++++++++++++++++++++++++++++++
]