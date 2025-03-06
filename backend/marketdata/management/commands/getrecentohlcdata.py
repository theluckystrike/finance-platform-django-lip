from django.core.management.base import BaseCommand
from marketdata.models import TickerSymbol, OHLCTimeSeries
from datetime import datetime, timedelta
import pandas as pd
import logging
import yfinance as yf
from django.utils import timezone
from django.db.utils import IntegrityError


logger = logging.getLogger('testlogger')
logging.getLogger('yfinance').setLevel(logging.CRITICAL)


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""


def get_ohlc_data(start_date, end_date, tickers):
    start_date = start_date.strftime('%Y-%m-%d')
    end_date = end_date.strftime('%Y-%m-%d')
    data = yf.download(tickers, start=start_date,
                       end=end_date, progress=True, threads=False)
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
    # most_recent_date = OHLCData.objects.all().order_by(
    #     "-date")[0].date
    # filtered_data = data[data["date"] > pd.to_datetime(most_recent_date)]
    count = 0
    for index, row in data.iterrows():
        try:
            newdata = OHLCTimeSeries(
                symbol=TickerSymbol.objects.get(symbol=row["symbol"]),
                date=row["date"],
                open=round(row["open"], 2),
                high=round(row["high"], 2),
                low=round(row["low"], 2),
                close=round(row["close"], 2),
                volume=int(row["volume"]),
            )
            newdata.save()
        except IntegrityError:
            count += 1
    logger.info(
        f"[ohlc data updater] Added {len(data)-count}/{len(data)} new ohlc entries to database")


class Command(BaseCommand):
    help = "Get recent OHLC data and add to database"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        parser.add_argument("-d", dest="days_back",
                            default=4, type=int, action='store')

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """
        days_back = options["days_back"]
        logger.info(
            f"[ohlc data updater] Started updating OHLC data")
        today = timezone.now().date()

        ohlc_start_date = today - timedelta(days=days_back)
        tickers = [t.symbol for t in TickerSymbol.objects.filter(
            tracking_timeseries=True)]

        ohlc_data = get_ohlc_data(ohlc_start_date, today, tickers)
        add_ohlc_data(ohlc_data)
        logger.info(
            f"[ohlc data updater] Finished updating OHLC data")
