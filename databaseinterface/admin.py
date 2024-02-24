from django.contrib import admin
from .models import OHLCData, IndexAction, IndexConstituent, Rate, StockExchangeData

# Register your models here.


@admin.register(OHLCData)
class OHLCDataAdmin(admin.ModelAdmin):
    ordering = ("-date",)


@admin.register(IndexAction)
class IndexActionsAdmin(admin.ModelAdmin):
    ordering = ("-date",)


@admin.register(IndexConstituent)
class IndexConstituentsAdmin(admin.ModelAdmin):
    ordering = ("-date_added",)


@admin.register(Rate)
class RateAdmin(admin.ModelAdmin):
    ordering = ("-date",)


@admin.register(StockExchangeData)
class StockExchangeAdmin(admin.ModelAdmin):
    ordering = ("-date",)
