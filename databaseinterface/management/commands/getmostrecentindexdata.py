from django.core.management.base import BaseCommand
from databaseinterface.models import IndexAction, IndexConstituent
from datetime import datetime, timedelta
import pandas as pd
import logging


logger = logging.getLogger('testlogger')


today = datetime.now().date()

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
    for index, row in data.iterrows():
        newdata = IndexConstituent(
            index=row["index"],
            ticker=row["symbol"],
            date_added=row["date_added"]
        )
        newdata.save()


def add_action_data(data):
    for index, row in data.iterrows():
        newdata = IndexAction(
            index=row["index"],
            ticker=row["symbol"],
            date=row["date"],
            name=row["name"]
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
        constituents_start_date = IndexConstituent.objects.all().order_by(
            "-date_added")[0].date_added + timedelta(days=1)
        constituent_data = get_constituents(constituents_start_date, today)
        add_constituent_data(constituent_data)
        logger.info(
            f"[index data updater] Found {len(constituent_data)} new constituent entries from {constituents_start_date.strftime('%Y-%m-%d')} to {today.strftime('%Y-%m-%d')}")

        actions_start_date = IndexAction.objects.all().order_by(
            "-date")[0].date + timedelta(days=1)
        actions_data = get_actions(actions_start_date, today)
        logger.info(
            f"[index data updater] Found {len(actions_data)} new action entries from {actions_start_date.strftime('%Y-%m-%d')} to {today.strftime('%Y-%m-%d')}")
        add_action_data(actions_data)
