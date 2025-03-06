from django.contrib import admin
from marketdata.models import OHLCTimeSeries, TickerSymbol


@admin.register(OHLCTimeSeries)
class OHLCTimeSeriesAdmin(admin.ModelAdmin):
    ordering = ("-date",)


class OHLCDataInline(admin.TabularInline):
    model = OHLCTimeSeries
    ordering = ("-date",)
    extra = 0
    readonly_fields = ["date", "open", "close", "high", "low", "volume"]
    can_delete = False


@admin.register(TickerSymbol)
class TickerSymbolAdmin(admin.ModelAdmin):
    ordering = ("symbol",)
    # inlines = [OHLCDataInline]
    search_fields = ["symbol"]
