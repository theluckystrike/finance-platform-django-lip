from django.contrib.auth.models import User
from rest_framework import serializers
from scriptupload.models import Script, ChartData, TableData


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class ChartDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChartData
        exclude = ["script"]


class TableDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableData
        exclude = ["script"]


class ScriptSerializer(serializers.ModelSerializer):
    chart_data = ChartDataSerializer(read_only=True)
    table_data = TableDataSerializer(read_only=True)

    class Meta:
        model = Script
        fields = ["name", "file", "category", "output_type",
                  "description", "id", "created", "chart_data", "table_data"]
        depth = 1
