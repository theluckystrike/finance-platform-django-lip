from django.core.management.base import BaseCommand, CommandError
from scriptupload.models import OHLCData, IndexActions, IndexConstituents
import pandas as pd
from django.utils.dateparse import parse_date


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""


def csv_to_ohlc():
    """
    An example for importing OHLC data from a csv
    """
    ohlc = pd.read_csv(
        "...../ex_ohlc.csv")

    for index, row in ohlc.iterrows():
        newdata = OHLCData(
            open=row['open'],
            close=row["close"],
            high=row["high"],
            low=row["low"],
            volume=row["volume"],
            ticker=row["ticker"],
            # use parse_date() to parse a date string to django DatetimeField
            # have to split and get first element to get "yyyy-mm-dd" from "yyyy-mm-dd hh:mm:ss-hh:mm:sss"
            date=parse_date(row["date"].split(" ")[0])
        )
        newdata.save()


def csv_to_actions():
    """
    An example for importing Index Action data from a csv
    """
    actions = pd.read_csv(
        "...../sp_500_actions.csv")

    for index, row in actions.iterrows():
        newdata = IndexActions(
            index="sp500",
            name=row["name"],
            ticker=row["ticker"],
            # use parse_date() to parse a date string to django DatetimeField
            date=parse_date(row["date"])
        )
        newdata.save()


def csv_to_constituents():
    """
    An example for importing Index constituent data from a csv
    """
    ohlc = pd.read_csv(
        "...../sp_500_constituents.csv")

    for index, row in ohlc.iterrows():
        if isinstance(row["date_added"], str):
            date = parse_date(row["date_added"])
        else:
            date = None
        newdata = IndexConstituents(
            ticker=row["ticker"],
            index="sp500",
            # use parse_date() to parse a date string to django DatetimeField
            date_added=date
        )
        newdata.save()


class Command(BaseCommand):
    help = "Update database"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """
        # example
        # csv_to_ohlc()
        # csv_to_actions()
        # csv_to_constituents()
