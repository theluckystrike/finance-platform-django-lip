from django.core.management.base import BaseCommand
from databaseinterface.models import IndexAction, IndexConstituent, OHLCData, StockExchangeData
from datetime import datetime, timedelta
import pandas as pd
import logging
import yfinance as yf
from django.utils import timezone
from django.db.utils import IntegrityError
import requests


logger = logging.getLogger('testlogger')
logging.getLogger('yfinance').setLevel(logging.CRITICAL)


headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Referer": "https://www.wsj.com/market-data/stocks/marketsdiary"
}
diaries_url = "https://www.wsj.com/market-data/stocks/marketsdiary?id=%7B%22application%22%3A%22WSJ%22%2C%22marketsDiaryType%22%3A%22diaries%22%7D&type=mdc_marketsdiary"

exchanges = ["NYSE", "NASDAQ"]
columns = [
    'exchange name',
    'Issues traded',
    'Advances',
    'Declines',
    #    'Unchanged',
    'New highs',
    'New lows',
    #   'Adv. volume*',
    #   'Decl. volume*',
    #   'Total volume*',
    #    'Closing Arms (TRIN)†',
    #    'Block trades*',
    'Adv. volume',
    'Decl. volume',
    # 'Total volume'
]


# def get_exchange_data():
#     response = requests.get(url, headers=headers)
#     if response.status_code != 200:
#         logger.error(
#             f"[stock exchange data updater] Failed to get stock exchange data. Status code {response.status_code} received. Error: {response.text}")
#         return None
#     date_string = response.json().get("data").get("timestamp")
#     parsed_date = datetime.strptime(date_string, "%A, %B %d, %Y")
#     clean_data = response.json().get("data").get("indexes")
#     df = pd.json_normalize(clean_data)
#     df = df[df["id"].isin(["nasdaq", "nyse"])]
#     for col in df.columns:
#         if col == 'id':
#             continue
#         df[col] = pd.to_numeric(df[col].astype(
#             str).str.replace(',', ''), errors='coerce')
#     df["date"] = parsed_date
#     return df

def get_exchange_data():
    response = requests.get(diaries_url, headers=headers)
    if response.status_code != 200:
        logger.error(
            f"[stock exchange data updater] Failed to get stock exchange data. Status code {response.status_code} received. Error: {response.text}")
        return None
    rjson = response.json()
    date_string = rjson.get('data').get('timestamp')
    parsed_date = datetime.strptime(date_string, "%A, %B %d, %Y")
    clean_data = rjson.get('data').get('instrumentSets')
    exchange_data = [clean_data[i] for i in range(
        len(clean_data)) if clean_data[i].get('headerFields')[0].get('label') in exchanges]
    df_data = {key: [] for key in columns}
    for exch in exchange_data:
        df_data['exchange name'].append(
            exch.get('headerFields')[0].get('label').lower())
        for item in exch.get("instruments"):
            if item.get('name') in columns:
                df_data[item.get('name')].append(
                    int(item.get('latestClose').replace(',', '')))
    df_data['date'] = [parsed_date] * len(exchanges)
    df = pd.DataFrame(df_data)
    df.columns = [c.replace(".", "").lower() for c in df.columns]
    return df


def add_exchange_data():
    data = get_exchange_data()
    if data is None:
        return
    error_count = 0
    for index, row in data.iterrows():
        try:
            new_data_point = StockExchangeData(
                date=row["date"],
                exchange_name=row["exchange name"],
                advances=int(row["advances"]),
                advances_volume=int(row["adv volume"]),
                declines=int(row["declines"]),
                declines_volume=int(row["decl volume"]),
                new_highs=int(row["new highs"]),
                new_lows=int(row["new lows"]),
                total_issues_traded=int(row["issues traded"]),
            )
            new_data_point.save()
        except IntegrityError:
            error_count += 1

    logger.info(
        f"[stock exchange data updater] Added {len(data)-error_count}/{len(data)} new entries to database with date {data.iloc[0].date}")


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

        logger.info(
            f"[stock exchange data updater] Updating Stock Exchange data")
        add_exchange_data()
        logger.info(
            f"[stock exchange data updater] Finished updating Stock Exchange data")
