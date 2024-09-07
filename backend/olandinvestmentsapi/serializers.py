from django.contrib.auth.models import User
from rest_framework import serializers
from scriptupload.models import Script, ChartData, TableData, Category, Report


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


class CategorySerializer(serializers.ModelSerializer):
    parent_category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = Category
        fields = ["name", "parent_category", "id"]
        # depth of 2 so that parent categories are returned up to top level
        depth = 2


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["name", "id", "script", "created", "last_updated", "status", "latest_pdf"]
        depth = 1