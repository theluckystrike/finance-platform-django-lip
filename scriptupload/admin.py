"""
Configures admin privileges that allows an admin to manage the site.

See https://docs.djangoproject.com/en/4.2/ref/contrib/admin/ for more details.
"""

from django.contrib import admin
from .models import Script, Category, Report


# admin.site.register(Script)
# admin.site.register(Category)

class CategoryInline(admin.TabularInline):
    model = Script.categories.through
    can_delete = True
    extra = 1


@admin.register(Script)
class ScriptAdmin(admin.ModelAdmin):
    inlines = [CategoryInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    pass
