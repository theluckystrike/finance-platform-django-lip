from django.contrib import admin
from .models import Script, ScriptCategory


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
