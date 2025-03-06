from rest_framework import serializers
from marketdata.models import OHLCTimeSeries, TickerSymbol


class OHLCSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = OHLCTimeSeries
        fields = ["symbol", "date", "open", "close", "high", "low", "volume"]


class TickerSymbolSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TickerSymbol
        fields = ["symbol", "id"]
