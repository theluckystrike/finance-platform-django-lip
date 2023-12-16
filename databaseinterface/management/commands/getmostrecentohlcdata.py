from django.core.management.base import BaseCommand
from databaseinterface.models import IndexAction, IndexConstituent, OHLCData
from datetime import datetime, timedelta
import pandas as pd
import logging
import yfinance as yf


logger = logging.getLogger('testlogger')
logging.getLogger('yfinance').setLevel(logging.CRITICAL)


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""


def get_ohlc_data(start_date, end_date):
    all_tickers = set([a.ticker for a in IndexAction.objects.all(
    )] + [b.ticker for b in IndexConstituent.objects.all()])
    start_date = start_date.strftime('%Y-%m-%d')
    end_date = end_date.strftime('%Y-%m-%d')
    data = yf.download(all_tickers, start=start_date,
                       end=end_date, progress=False, threads=False)
    ohlc_data = pd.concat([data['Adj Close'].stack(),
                           data['Close'].stack(),
                           data['High'].stack(),
                           data['Low'].stack(),
                           data['Open'].stack(),
                           data['Volume'].stack()], axis=1)

    ohlc_data.reset_index(drop=False, inplace=True)
    ohlc_data.columns = ['date', 'symbol', 'adj_close',
                         'close', 'high', 'low', 'open', 'volume']
    ohlc_data = ohlc_data[['symbol', 'open', 'high',
                           'low', 'close', 'adj_close', 'volume', 'date']]
    ohlc_data['volume'] = ohlc_data['volume'].astype(int)
    return ohlc_data


def add_ohlc_data(data):
    most_recent_date = OHLCData.objects.all().order_by(
        "-date")[0].date
    filtered_data = data[data["date"] > pd.to_datetime(most_recent_date)]
    for index, row in filtered_data.iterrows():
        newdata = OHLCData(
            ticker=row["symbol"],
            date=row["date"],
            open=round(row["open"], 3),
            high=round(row["high"], 3),
            low=round(row["low"], 3),
            close=round(row["close"], 3),
            volume=int(row["volume"]),
        )
        newdata.save()
    logger.info(
        f"[ohlc data updater] Added {len(filtered_data)}/{len(data)} new ohlc entries to database")


class Command(BaseCommand):
    help = "Get recent OHLC data and add to database"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """
        today = datetime.now().date() + timedelta(days=1)
        ohlc_start_date = OHLCData.objects.all().order_by(
            "-date")[0].date + timedelta(days=1)
        if ohlc_start_date == today:
            logger.info(
                f"[ohlc data updater] Aborting ohlc update since most recent data is from yesterday")
        else:
            ohlc_data = get_ohlc_data(ohlc_start_date, today)
            logger.info(
                f"[ohlc data updater] Found {len(ohlc_data)} new ohlc entries from {ohlc_start_date.strftime('%Y-%m-%d')} to {today.strftime('%Y-%m-%d')}")
            add_ohlc_data(ohlc_data)
