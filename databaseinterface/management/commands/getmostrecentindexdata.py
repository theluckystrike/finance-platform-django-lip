from django.core.management.base import BaseCommand
from databaseinterface.models import IndexAction, IndexConstituent
from datetime import datetime, timedelta
import pandas as pd
import logging
from django.utils import timezone
from django.db.utils import IntegrityError


logger = logging.getLogger('testlogger')


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""


def get_constituents(start_date, end_date):
    sp_500_url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'

    sp_500_constituents = pd.read_html(sp_500_url, header=0)[
        0].rename(columns=str.lower)
    sp_500_constituents.insert(0, 'index', 'GSPC')
    sp_500_constituents = sp_500_constituents[[
        'index', 'symbol', 'date added']]
    sp_500_constituents.columns = ['index', 'symbol', 'date_added']
    sp_500_constituents["date_added"] = pd.to_datetime(
        sp_500_constituents["date_added"])
    sp_500_constituents = sp_500_constituents[sp_500_constituents["date_added"]
                                              >= pd.to_datetime(start_date)]
    sp_500_constituents = sp_500_constituents[sp_500_constituents["date_added"]
                                              < pd.to_datetime(end_date)]
    return sp_500_constituents


def get_actions(start_date, end_date):
    sp_500_url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'

    sp_500_actions = pd.read_html(sp_500_url, header=0)[
        1].rename(columns=str.lower)

    added = sp_500_actions.copy()
    added = added[['date', 'added']].rename(columns=added.iloc[0]).iloc[1:]
    added['action'] = 'added'
    removed = sp_500_actions.copy()
    removed = removed[['date', 'removed']].rename(
        columns=removed.iloc[0]).iloc[1:]
    removed['action'] = 'removed'

    sp_500_actions = pd.concat(
        [added, removed], axis=0).dropna().reset_index(drop=True)
    sp_500_actions['Date'] = pd.to_datetime(sp_500_actions['Date'])
    sp_500_actions.columns = ['date', 'symbol', 'name']
    sp_500_actions = sp_500_actions[['symbol', 'date', 'name']]
    sp_500_actions.insert(0, 'index', 'GSPC')
    sp_500_actions = sp_500_actions[sp_500_actions["date"] >= pd.to_datetime(
        start_date)]
    sp_500_actions = sp_500_actions[sp_500_actions["date"] < pd.to_datetime(
        end_date)]
    return sp_500_actions


def add_constituent_data(data):
    most_recent_date = IndexConstituent.objects.all().order_by(
        "-date_added")[0].date_added
    filtered_data = data[data["date_added"] > pd.to_datetime(most_recent_date)]
    for index, row in filtered_data.iterrows():
        newdata = IndexConstituent(
            index=row["index"],
            ticker=row["symbol"],
            date_added=row["date_added"]
        )
        newdata.save()
    logger.info(
        f"[index data updater] Added {len(filtered_data)}/{len(data)} new constituent entries to database")


def add_action_data(data):
    count = 0
    for index, row in data.iterrows():
        try:
            newdata = IndexAction(
                index=row["index"],
                ticker=row["symbol"],
                date=row["date"],
                name=row["name"]
            )
            newdata.save()
        except IntegrityError:
            count += 1
    logger.info(
        f"[index data updater] Added {len(data)-count}/{len(data)} new action entries to database")


class Command(BaseCommand):
    help = "Get recent index action and constituent data and add to database"

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
            f"[index data updater] Starting updating index actions and constituents data")
        today = timezone.now().date() + timedelta(days=1)
        constituents_start_date = today - timedelta(days=days_back)

        constituent_data = get_constituents(constituents_start_date, today)
        logger.info(
            f"[index data updater] Found {len(constituent_data)} new constituent entries from {constituents_start_date.strftime('%Y-%m-%d')} to {today.strftime('%Y-%m-%d')}")
        add_constituent_data(constituent_data)

        actions_start_date = constituents_start_date

        actions_data = get_actions(actions_start_date, today)
        logger.info(
            f"[index data updater] Found {len(actions_data)} new action entries from {actions_start_date.strftime('%Y-%m-%d')} to {today.strftime('%Y-%m-%d')}")
        add_action_data(actions_data)
