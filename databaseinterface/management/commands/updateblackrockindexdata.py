from django.core.management.base import BaseCommand
from databaseinterface.models import BlackRockIndexData
from datetime import datetime
import pandas as pd
import logging
from django.db.utils import IntegrityError
import requests
import json


logger = logging.getLogger("testlogger")
logging.getLogger("yfinance").setLevel(logging.CRITICAL)

indexes = {
    "XEG": "https://www.blackrock.com/ca/investors/en/products/239839/ishares-sptsx-capped-energy-index-etf/1464253357814.ajax?tab=all&fileType=json",
    "XDG": "https://www.blackrock.com/ca/investors/en/products/239848/ishares-sptsx-global-gold-index-etf/1464253357814.ajax?tab=all&fileType=json"
}

columns = [
    "Ticker",
    "Name",
    "Sector",
    "Weight (%)",
    "Notional Value",
    "ISIN",
    "Location of Risk",
    "Exchange",
    "Currency",
    "FX Rate",
]


def get_index_data(url, indexticker):
    response = requests.get(url)
    if response.status_code != 200:
        logger.error(
            f"[black rock index updater] Failed to get index {indexticker}. Status code {response.status_code} received. Error: {response.text}"
        )
        return None
    rjson = json.loads(response.text.replace("\ufeff", ""))
    data = rjson.get("aaData")
    data = [
        [a, b, c, d.get("raw"), e.get("raw"), f, g, h, i, j]
        for a, b, c, d, e, f, g, h, i, j in data
    ]

    data = pd.DataFrame(data, columns=columns)
    todays_date = datetime.today().date()
    data["date"] = todays_date
    return data


def add_index_data(url, indexticker):
    data = get_index_data(url, indexticker)
    if data is None:
        return
    error_count = 0
    for index, row in data.iterrows():
        try:
            new_data_point = BlackRockIndexData(
                date=row["date"],
                indexticker=indexticker,
                ticker=row["Ticker"],
                name=row["Name"],
                sector=row["Sector"],
                weight=float(row["Weight (%)"]),
                notional_value=float(row["Notional Value"]),
                isin=row["ISIN"],
                location_of_risk=row["Location of Risk"],
                exchange=row["Exchange"],
                currency=row["Currency"],
                fx_rate=float(row["FX Rate"]),
            )
            new_data_point.save()
        except IntegrityError:
            error_count += 1

    logger.info(
        f"[blackrock index data updater] Added {len(data)-error_count}/{len(data)} new entries to database with date {data.iloc[0].date} for {indexticker}"
    )


class Command(BaseCommand):
    help = "Get BlackRock iShares S&P TSX data and add to database"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        parser.add_argument("-d", dest="days_back", default=4, type=int, action="store")

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """

        for indexticker, url in indexes.items():
            logger.info(f"[blackrock index data updater] Updating index data for {indexticker}")
            add_index_data(url, indexticker)
            logger.info(f"[blackrock index data updater] Finished updating index data for {indexticker}")
