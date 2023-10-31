"""
Configures admin privileges that allows an admin to manage the site.

See https://docs.djangoproject.com/en/4.2/ref/contrib/admin/ for more details.
"""

from django.contrib import admin
from .models import Script, ScriptCategory, OHLCData, IndexActions, IndexConstituents


# admin.site.register(Script)
# admin.site.register(ScriptCategory)

class ScriptCategoryInline(admin.TabularInline):
    model = Script.categories.through
    can_delete = True
    extra = 1


@admin.register(Script)
class ScriptAdmin(admin.ModelAdmin):
    inlines = [ScriptCategoryInline]


@admin.register(ScriptCategory)
class ScriptCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(OHLCData)
class OHLCDataAdmin(admin.ModelAdmin):
    pass


@admin.register(IndexActions)
class IndexActionsAdmin(admin.ModelAdmin):
    pass


@admin.register(IndexConstituents)
class IndexConstituentsAdmin(admin.ModelAdmin):
    pass
