from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    OHLCData,
    IndexAction,
    IndexConstituent,
    Rate,
    StockExchangeData,
    BlackRockIndexData,
)

# importing from other app to keep all DRF related content in this app
from scriptupload.models import Script
from collections import defaultdict
import csv


class ScriptSerializer(serializers.HyperlinkedModelSerializer):
    table_data = serializers.SerializerMethodField()

    class Meta:
        model = Script
        fields = ["name", "table_data"]
        ref_name = 'ScriptDataSerializer'

    def get_table_data(self, obj):
        if obj.has_table_data:
            csv_file = obj.table_data_file
            data = defaultdict(list)
            f = csv_file.open("r")
            reader = csv.DictReader(f)
            for row in reader:
                for key, value in row.items():
                    data[key].append(value)
            return dict(data)
        return None


class OHLCSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = OHLCData
        fields = ["ticker", "date", "open", "close", "high", "low", "volume"]


class IndexActionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = IndexAction
        fields = ["index", "ticker", "date", "name"]


class IndexConstituentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = IndexConstituent
        fields = ["index", "ticker", "date_added"]


class RateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rate
        fields = ["date", "rate", "country", "term"]


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class StockExchangeDataSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = StockExchangeData
        fields = [
            "date",
            "exchange_name",
            "advances",
            "advances_volume",
            "declines",
            "declines_volume",
            "new_highs",
            "new_lows",
            "total_issues_traded",
        ]


class BlackRockIndexDataSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BlackRockIndexData
        fields = [
            "date",
            "ticker",
            "name",
            "sector",
            "weight",
            "notional_value",
            "isin",
            "location_of_risk",
            "exchange",
            "currency",
            "fx_rate",
        ]
