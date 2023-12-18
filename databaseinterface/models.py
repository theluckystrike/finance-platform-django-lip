from django.db import models
from datetime import datetime


class OHLCData(models.Model):
    """
    Open, high, low, close data
    """
    ticker = models.CharField(max_length=5)
    date = models.DateField()
    open = models.DecimalField(max_digits=19, decimal_places=3)
    high = models.DecimalField(max_digits=19, decimal_places=3)
    low = models.DecimalField(max_digits=19, decimal_places=3)
    close = models.DecimalField(max_digits=19, decimal_places=3)
    volume = models.BigIntegerField()

    class Meta:
        verbose_name = "OHLC Data"
        verbose_name_plural = "OHLC Data"

    def __str__(self):
        return f"{self.ticker}-{datetime.strftime(self.date, r'%Y-%m-%d')}"


class IndexConstituent(models.Model):
    index = models.CharField(max_length=5)
    ticker = models.CharField(max_length=5)
    date_added = models.DateField(blank=True, null=True)

    class Meta:
        verbose_name = "Index Constituent"
        verbose_name_plural = "Index Constituents"

    def __str__(self):
        return f"{self.ticker} added to {self.index} on {self.date_added}"


class IndexAction(models.Model):
    index = models.CharField(max_length=5)
    ticker = models.CharField(max_length=5)
    date = models.DateField()
    name = models.CharField(max_length=7)

    class Meta:
        verbose_name = "Index Action"
        verbose_name_plural = "Index Actions"

    def __str__(self):
        if self.name == "added":
            s = f"{self.ticker} added to {self.index} on {self.date}"
        elif self.name == "removed":
            s = f"{self.ticker} removed from {self.index} on {self.date}"
        else:
            s = "Name of Action not in ['added', 'removed']"
        return s


class Rate(models.Model):
    date = models.DateField()
    rate = models.DecimalField(max_digits=6, decimal_places=2)
    country = models.CharField(max_length=2)
    term = models.CharField(max_length=6)

    class Meta:
        verbose_name = "Rate"
        verbose_name_plural = "Rates"

    def __str__(self):
        return f"{self.country}-{self.date}-{self.term}"
