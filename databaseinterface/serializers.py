from django.contrib.auth.models import User
from rest_framework import serializers
from .models import OHLCData, IndexAction, IndexConstituent, Rate, StockExchangeData


class OHLCSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = OHLCData
        fields = ['ticker', 'date', 'open', 'close', 'high', 'low', 'volume']


class IndexActionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = IndexAction
        fields = ['index', 'ticker', 'date', 'name']


class IndexConstituentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = IndexConstituent
        fields = ['index', 'ticker', 'date_added']


class RateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rate
        fields = ['date', 'rate', 'country', 'term']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class StockExchangeDataSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = StockExchangeData
        fields = ['date', 'exchange_name', "advances", "advances_volume", "declines",
                  "declines_volume", "new_highs", "new_lows", "total_issues_traded"]
