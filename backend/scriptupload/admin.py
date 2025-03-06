"""
Configures admin privileges that allows an admin to manage the site.

See https://docs.djangoproject.com/en/4.2/ref/contrib/admin/ for more details.
"""

from django.contrib import admin
from .models import Script, Category, Report, ReportEmailTask, TableData, ChartData


class ChartDataInline(admin.StackedInline):
    model = ChartData


class TableDataInline(admin.StackedInline):
    model = TableData


@admin.register(Script)
class ScriptAdmin(admin.ModelAdmin):
    ordering = ("-created",)
    inlines = [ChartDataInline, TableDataInline]
    search_fields = ["name", "description"]


@admin.register(TableData)
class TableDataAdmin(admin.ModelAdmin):
    ordering = ("-created",)


@admin.register(ChartData)
class ChartDataAdmin(admin.ModelAdmin):
    ordering = ("-created",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    ordering = ("name",)


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    ordering = ("-created",)


@admin.register(ReportEmailTask)
class ReportEmailTaskAdmin(admin.ModelAdmin):
    ordering = ("report",)
