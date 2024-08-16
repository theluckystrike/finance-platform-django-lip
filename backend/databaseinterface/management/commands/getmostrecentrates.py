from django.db.utils import IntegrityError
from fredapi import Fred  # https://mortada.net/python-api-for-fred.html
from django.core.management.base import BaseCommand
from lxml import etree
from datetime import datetime, timedelta
import requests
import pandas as pd
from databaseinterface.models import Rate
import logging
import os
from dotenv import load_dotenv
from django.utils import timezone

if not ("DYNO" in os.environ):
    load_dotenv()


logger = logging.getLogger('testlogger')

"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""


def us_benchmark_yield(terms, start_date, end_date, start_year, end_year):
    child_element_nsmap = {
        'd': 'http://schemas.microsoft.com/ado/2007/08/dataservices'
    }
    base_url = "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value="
    if type(terms) == int:
        terms_dict = {f"r_{terms}yr": {
            "namespace": f".//d:BC_{terms}YEAR", "data": {}}}
    elif type(terms) == float:
        terms_dict = {
            "namespace": f".//d:BC_{int(terms * 12)}MONTH", "data": {}}
    elif type(terms) == list:
        terms_dict = {f"r_{t}yr" if type(t) == int else f"r_{int(t * 12)}m": {"namespace": f".//d:BC_{t}YEAR", "data": {}} if type(t) == int
                      else {"namespace": f".//d:BC_{int(t * 12)}MONTH", "data": {}}
                      for t in terms}

    endpoints = [base_url + str(x) for x in range(start_year, end_year + 1)]

    for endpoint_url in endpoints:
        response = requests.get(endpoint_url)
        root = etree.fromstring(response.content)
        elements = root.findall('.//d:properties',
                                namespaces={'d': 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata'})
        for element in elements:
            date = element.find(
                ".//d:NEW_DATE", namespaces=child_element_nsmap).text
            for k, v in terms_dict.items():
                r_val = element.find(
                    v["namespace"], namespaces=child_element_nsmap).text
                terms_dict[k]["data"][date] = float(r_val)

    for k, v in terms_dict.items():
        s = pd.Series(terms_dict[k]["data"])
        s.index = pd.DatetimeIndex(s.index)
        s.name = k
        terms_dict[k]["data"] = s[start_date:end_date]
    return terms_dict


def cdn_benchmark_yield(term, start_date, end_date):
    # ["2YR","5YR","10YR","LONG"]
    if term == '30YR':
        term = "LONG"
    elif term == 30:
        term = "LONG"
    elif type(term) == int:
        term = f"{term}YR"
    # URL for the Bank of Canada 2-year benchmark yield in JSON format
    url = f'https://www.bankofcanada.ca/valet/observations/BD.CDN.{term}.DQ.YLD/json?start_date={start_date}&end_date={end_date}'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if len(data['observations']) == 0:
            data_key = []
        else:
            data_key = list(data['observations'][0].keys())[1]
        s = pd.Series({x['d']: x[data_key]['v']
                      for x in data['observations']}).astype(float)
        s.name = term
        s.index = pd.DatetimeIndex(s.index)
        return s
    raise Exception("Could not get cdn benchmark yield data")


def cdn_get_series(series_id, start_date, end_date):
    # overnight: V39079; 3M: V122531
    url = f"https://www.bankofcanada.ca/valet/observations/{series_id}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
    ca_o = pd.Series({x['d']: x[series_id]['v'] for x in data['observations']})
    ca_o.index = pd.DatetimeIndex(ca_o.index)
    ca_o = ca_o.astype(float)
    ca_o = ca_o[start_date: end_date]
    return ca_o


def get_us_data(start_date, end_date):
    current_year = timezone.now().year
    us_yields = us_benchmark_yield(
        terms=[0.25, 2, 5, 10, 30], start_year=current_year, end_year=current_year, start_date=start_date, end_date=end_date)
    fred = Fred()
    us_on_yield = fred.get_series(
        'FEDFUNDS', observation_start=start_date, obeservation_end=end_date)
    return us_yields, us_on_yield


def get_cdn_data(start_date, end_date):
    cdn_2yr_yield = cdn_benchmark_yield(2, start_date, end_date)
    cdn_5yr_yield = cdn_benchmark_yield(5, start_date, end_date)
    cdn_10yr_yield = cdn_benchmark_yield(10, start_date, end_date)
    cdn_30yr_yield = cdn_benchmark_yield(30, start_date, end_date)
    cdn_3m_yield = cdn_get_series("TB.CDN.90D.MID", start_date, end_date)
    cdn_on_yield = cdn_get_series("V39079", start_date, end_date)
    return cdn_2yr_yield, cdn_5yr_yield, cdn_10yr_yield, cdn_30yr_yield, cdn_3m_yield, cdn_on_yield


def rates_data_to_df(start_date, end_date):
    us_yields, us_on_yield = get_us_data(start_date, end_date)
    cdn_2yr_yield, cdn_5yr_yield, cdn_10yr_yield, cdn_30yr_yield, cdn_3m_yield, cdn_on_yield = get_cdn_data(
        start_date, end_date)
    data = {"CA.2YR": cdn_2yr_yield,
            "CA.5YR": cdn_5yr_yield,
            "CA.10YR": cdn_10yr_yield,
            "CA.30YR": cdn_30yr_yield,
            "US.2YR": us_yields['r_2yr']['data'],
            "US.5YR": us_yields['r_5yr']['data'],
            "US.10YR": us_yields['r_10yr']['data'],
            "US.30YR": us_yields['r_30yr']['data'],
            "US.3M": us_yields['r_3m']['data'],
            "CA.3M": cdn_3m_yield,
            "US.ON": us_on_yield,
            "CA.ON": cdn_on_yield}

    l = []
    for k, v in data.items():
        df = pd.DataFrame(v).reset_index()
        df.columns = ['date', 'rate']
        df['country'] = k.split('.')[0]
        df['term'] = k.split('.')[1]
        l.append(df)
    df = pd.concat(l).reset_index(drop=True)
    return df


def add_rate_data(data):
    count = 0
    for index, row in data.iterrows():
        try:
            newdata = Rate(
                date=row["date"],
                rate=round(row["rate"], 2),
                country=row["country"],
                term=row["term"]
            )
            newdata.save()
        except IntegrityError:
            count += 1
    logger.info(
        f"[rate data updater] Added {len(data)-count}/{len(data)} new rate entries to database")


class Command(BaseCommand):
    help = "Get recent rates data and add to database"

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
            f"[rate data updater] Started updating rates data")
        today = timezone.now().date() + timedelta(days=1)
        rates_start_date = today - timedelta(days=days_back)
        try:
            rates_data = rates_data_to_df(rates_start_date, today)
        except Exception as e:
            logger.info(f"[rate data updater] Could not get rates data -> {e}")
            return
        logger.info(
            f"[rate data updater] Found {len(rates_data)} new rates entries from {rates_start_date.strftime('%Y-%m-%d')} to {today.strftime('%Y-%m-%d')}")
        # print(rates_start_date, rates_data)
        add_rate_data(rates_data)
