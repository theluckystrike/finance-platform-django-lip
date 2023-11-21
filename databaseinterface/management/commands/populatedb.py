from django.core.management.base import BaseCommand
import pandas as pd
from databaseinterface.models import OHLCData, Rate


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""


def populate_ohlc():
    ohlc = pd.read_csv('ohlc.csv')
    for index, row in ohlc.iterrows():
        newdata = OHLCData(
            ticker=row['symbol'],
            date=row['date'],
            open=round(row['open'], 6),
            close=round(row['close'], 6),
            high=round(row['high'], 6),
            low=round(row['low'], 6),
            volume=row['volume']
        )
        newdata.save()


def populate_rates():
    ohlc = pd.read_csv('rates_data.csv')
    for index, row in ohlc.iterrows():
        newdata = Rate(
            rate=row['rate'],
            country=row['country'],
            date=row['date'],
            term=row['term']
        )
        newdata.save()


class Command(BaseCommand):
    help = "Populate database"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """
        populate_ohlc()
        populate_rates()
