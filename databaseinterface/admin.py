from django.contrib import admin
from .models import OHLCData, IndexAction, IndexConstituent, Rate

# Register your models here.


@admin.register(OHLCData)
class OHLCDataAdmin(admin.ModelAdmin):
    pass


@admin.register(IndexAction)
class IndexActionsAdmin(admin.ModelAdmin):
    pass


@admin.register(IndexConstituent)
class IndexConstituentsAdmin(admin.ModelAdmin):
    pass


@admin.register(Rate)
class RateAdmin(admin.ModelAdmin):
    pass
