from django.contrib.auth.models import User
from rest_framework import serializers
from .models import OHLCData, IndexAction, IndexConstituent, Rate


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
