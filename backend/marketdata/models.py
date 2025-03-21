from django.db import models
from datetime import datetime


class TickerSymbol(models.Model):
    symbol = models.CharField(max_length=15, unique=True)
    tracking_timeseries = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Ticker'
        verbose_name_plural = 'Tickers'

    def __str__(self):
        return self.symbol


class OHLCTimeSeries(models.Model):
    """
    open, high, low, close data
    """

    symbol = models.ForeignKey(
        TickerSymbol, to_field='symbol', on_delete=models.CASCADE, related_name='ohlc_data', db_column='symbol')
    date = models.DateField()
    open = models.DecimalField(max_digits=10, decimal_places=2)
    high = models.DecimalField(max_digits=10, decimal_places=2)
    low = models.DecimalField(max_digits=10, decimal_places=2)
    close = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.BigIntegerField()

    class Meta:
        verbose_name = "OHLC Time Series"
        verbose_name_plural = "OHLC Time Series"
        unique_together = ['symbol', 'date']

    def __str__(self):
        return f"{self.symbol} OHLC {datetime.strftime(self.date, r'%Y-%m-%d')}"
