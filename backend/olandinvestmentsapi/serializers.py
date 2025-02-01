from django.contrib.auth.models import User
from rest_framework import serializers
from scriptupload.models import Script, ChartData, TableData, Category, Report, ReportEmailTask
from olandinvestmentsapi.models import Summary


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "groups"]


class ChartDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChartData
        exclude = ["script"]


class TableDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableData
        exclude = ["script"]


class DeepCategorySerializer(serializers.ModelSerializer):
    level = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["name", "parent_category", "id", "level"]
        # depth of 2 so that parent categories are returned up to top level
        depth = 2

    def get_level(self, obj):
        return obj.get_level()


class CategorySerializer(serializers.ModelSerializer):
    parent_category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), allow_null=True, required=False)
    level = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["name", "parent_category", "id", "level"]

    def get_level(self, obj):
        return obj.get_level()

    # https://stackoverflow.com/a/35897731
    # nested self-referential serialization
    # does not work with drf-yasg https://github.com/axnsan12/drf-yasg/issues/632
    # def get_fields(self):
    #     fields = super().get_fields()
    #     fields['parent_category'] = CategorySerializer()
    #     return fields


class ScriptUploadSerializer(serializers.ModelSerializer):
    '''Only for reading multipart form data and making a new Script via POST request'''
    file = serializers.FileField()

    class Meta:
        model = Script
        fields = ['name', 'category', 'file',
                  'description', 'for_summary', 'output_type']


class ScriptSerializerLite(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    category = DeepCategorySerializer()

    class Meta:
        model = Script
        fields = ["name", "file", "category", "output_type",
                  "description", "id", "created", "status", "last_updated", "for_summary"]

    def get_status(self, obj):
        return obj.get_status_display()


class ScriptSearchSerializer(serializers.HyperlinkedModelSerializer):
    category = DeepCategorySerializer()
    url = serializers.HyperlinkedIdentityField(view_name="scripts-detail")

    class Meta:
        model = Script
        fields = ["name", "category", "id", "url"]


class ReportSearchSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name="reports-detail")

    class Meta:
        model = Script
        fields = ["name", "id", "url"]


class ScriptSerializer(serializers.ModelSerializer):
    chart_data = ChartDataSerializer(read_only=True)
    table_data = TableDataSerializer(read_only=True)
    status = serializers.SerializerMethodField()
    category = DeepCategorySerializer()

    class Meta:
        model = Script
        fields = ["name", "file", "category", "output_type",
                  "description", "id", "created", "chart_data", "table_data", "status", "last_updated", "for_summary"]
        depth = 1

    def get_status(self, obj):
        return obj.get_status_display()


class ScriptSerializerForReport(serializers.ModelSerializer):
    category = DeepCategorySerializer()

    class Meta:
        model = Script
        fields = ["name", "id", "created", "category"]
        depth = 1


class ReportReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Report
        fields = ["name", "id", "scripts", "created",
                  "last_updated", "status", "latest_pdf"]
        depth = 1

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        scripts = instance.scripts.all().order_by(
            "category__name", 'index_in_category')
        ss = ScriptSerializerForReport(many=True, data=scripts)
        ss.is_valid()
        representation['scripts'] = ss.data
        return representation


class ReportWriteSerializer(serializers.ModelSerializer):
    # this will include IDs only
    scripts = serializers.PrimaryKeyRelatedField(
        queryset=Script.objects.all(), allow_null=False, required=True, many=True)
    summaries = serializers.PrimaryKeyRelatedField(
        queryset=Summary.objects.all(), allow_null=True, required=False, many=True)
    # this gives hyperlinks to each script
    # scripts = serializers.HyperlinkedRelatedField(
    #     queryset=Script.objects.all(), allow_null=False, many=True, view_name="scripts-detail")

    class Meta:
        model = Report
        fields = ["name", "id", "scripts", "created",
                  "last_updated", "status", "latest_pdf", "summaries"]
        depth = 1

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        scripts = instance.scripts.all().order_by(
            'index_in_category').order_by("category__name")
        representation['scripts'] = [script.id for script in scripts]
        return representation


class ReportEmailTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportEmailTask
        fields = "__all__"


class SummarySerializer(serializers.ModelSerializer):
    scripts = serializers.PrimaryKeyRelatedField(
        queryset=Script.objects.all(), allow_null=False, required=True, many=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Summary
        fields = ["id", "name", "scripts",
                  "meta", "created", "signal_plot_data", "status"]

    def get_status(self, obj):
        print("getting status")
        return obj.get_status_display()


class SummarySerializerLite(serializers.ModelSerializer):
    scripts = serializers.PrimaryKeyRelatedField(
        queryset=Script.objects.all(), allow_null=False, required=True, many=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Summary
        fields = ["id", "name", "scripts", "created", "status"]

    def get_status(self, obj):
        return obj.get_status_display()


class SummaryMetaSerializer(serializers.ModelSerializer):
    '''Used only for making new summaries from post requests'''
    scripts = serializers.DictField(
        child=serializers.CharField(), write_only=True)

    class Meta:
        model = Summary
        fields = ["scripts", "name", "meta"]

    def validate_scripts(self, value):
        print("Validating scripts:", value)
        if not isinstance(value, dict):
            raise serializers.ValidationError(
                "Scripts must be a dictionary mapping from ID to column name")
        if len(value) == 0:
            raise serializers.ValidationError("Scripts cannot be empty")
        for sid, col_name in value.items():
            if not Script.objects.filter(id=int(sid)).exists():
                raise serializers.ValidationError(
                    f"Script with ID {sid} does not exist")
            if col_name is None:
                raise serializers.ValidationError(
                    "Cannot have null column name")
            # TODO: validate column name is in table data column names
        return value

    def create(self, validated_data):
        script_map = validated_data.pop("scripts")
        validated_data['scripts'] = script_map.keys()
        validated_data["meta"] = {
            "scripts": {
                sid: {
                    "name": Script.objects.get(id=sid).name,
                    "table_col_name": col_name,
                    "table_col_last_value": None
                } for sid, col_name in script_map.items()
            }
        }
        return super().create(validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)

        script_map = validated_data.get('scripts', {})
        instance.scripts.clear()
        for sid, col_name in script_map.items():
            script = Script.objects.get(id=int(sid))
            instance.scripts.add(script)
            instance.meta['scripts'][sid] = {
                "name": script.name,
                "table_col_name": col_name,
                "table_col_last_value": None
            }

        instance.save()
        return instance


class SummarySearchSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name="summaries-detail")

    class Meta:
        model = Summary
        fields = ["name", "id", "url", "created", "status"]
