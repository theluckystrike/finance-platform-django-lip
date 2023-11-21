from django.db import models
from datetime import datetime

# Create your models here.


class OHLCData(models.Model):
    """
    Open, high, low, close data
    """
    ticker = models.CharField(max_length=5)
    date = models.DateField()
    open = models.DecimalField(max_digits=19, decimal_places=6)
    high = models.DecimalField(max_digits=19, decimal_places=6)
    low = models.DecimalField(max_digits=19, decimal_places=6)
    close = models.DecimalField(max_digits=19, decimal_places=6)
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
        return f"{self.ticker}-{self.index}"

# TODO: could create many to many field of tickers
# to store the stocks in each index
# would mean renaming IndexConstituents to just stock


class IndexAction(models.Model):
    index = models.CharField(max_length=5)
    ticker = models.CharField(max_length=5)
    date = models.DateField()
    name = models.CharField(max_length=7)  # (added, removed)

    class Meta:
        verbose_name = "Index Action"
        verbose_name_plural = "Index Actions"

    def __str__(self):
        return f"{self.ticker}-{self.index}"


class Rate(models.Model):
    date = models.DateField()
    rate = models.DecimalField(max_digits=19, decimal_places=6)
    country = models.CharField(max_length=2)
    term = models.CharField(max_length=6)

    class Meta:
        verbose_name = "Rate"
        verbose_name_plural = "Rates"

    def __str__(self):
        return f"{self.country}-{self.date}"


# set signals


# class Stock(models.Model):
#     name = models.CharField(max_length=15)
#     ticker = models.CharField(max_length=5)
#     # no date_added

# class Index(models.Model):
#     name = models.CharField(max_length=15)
#     ticker = models.CharField(max_length=5)
#     stocks = models.ManyToManyField(Stock)


# class IndexAction(models.Model):
#     index = models.ForeignKey(Index)
#     stock = models.ForeignKey(Stock)
#     date = models.DateTimeField()
#     name = models.CharField(max_length=7)

# class OHLCData(models.Model):
#     stock = models.ForeignKey(Stock) # CASCADE or something
#     date = models.DateTimeField()
#     open = models.DecimalField(max_digits=19, decimal_places=4)
#     high = models.DecimalField(max_digits=19, decimal_places=4)
#     low = models.DecimalField(max_digits=19, decimal_places=4)
#     close = models.DecimalField(max_digits=19, decimal_places=4)
#     volume = models.BigIntegerField()
