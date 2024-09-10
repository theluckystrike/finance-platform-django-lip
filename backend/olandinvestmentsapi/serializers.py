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
    status = serializers.SerializerMethodField()

    class Meta:
        model = Script
        fields = ["name", "file", "category", "output_type",
                  "description", "id", "created", "chart_data", "table_data", "status", "last_updated"]
        depth = 1

    def get_status(self, obj):
        return obj.get_status_display()


class CategorySerializer(serializers.ModelSerializer):
    parent_category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False)
    level = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["name", "parent_category", "id", "level"]
        # depth of 2 so that parent categories are returned up to top level
        depth = 2

    def get_level(self, obj):
        return obj.get_level()

    # https://stackoverflow.com/a/35897731
    # nested self-referential serialization
    # does not work with drf-yasg https://github.com/axnsan12/drf-yasg/issues/632
    # def get_fields(self):
    #     fields = super().get_fields()
    #     fields['parent_category'] = CategorySerializer()
    #     return fields


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
