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

    class Meta:
        model = Category
        fields = ["name", "parent_category", "id"]
        # depth of 2 so that parent categories are returned up to top level
        depth = 2

    # https://stackoverflow.com/a/35897731
    # nested self-referential serialization
    def get_fields(self):
        fields = super(CategorySerializer, self).get_fields()
        fields['parent_category'] = CategorySerializer()
        return fields


class ReportSerializer(serializers.ModelSerializer):
    # this will include IDs only
    scripts = serializers.PrimaryKeyRelatedField(
        queryset=Script.objects.all(), allow_null=False, required=True, many=True)
    # this gives hyperlinks to each script
    # scripts = serializers.HyperlinkedRelatedField(
    #     queryset=Script.objects.all(), allow_null=False, many=True, view_name="scripts-detail")

    class Meta:
        model = Report
        fields = ["name", "id", "scripts", "created",
                  "last_updated", "status", "latest_pdf"]
        depth = 1
