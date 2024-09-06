from rest_framework import serializers
from .models import Category ,Script


class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.IntegerField(write_only=True, required=False,allow_null=True)

    class Meta:
        model = Category
        fields = ("name", "parent")

    def create(self, validated_data):
        parent_id = validated_data.pop('parent', None)
        category = Category.objects.create(**validated_data)
        if parent_id:
            parent_category = Category.objects.get(id=parent_id)
            category.parent_category = parent_category
            category.save()
        return category

    def update(self, instance, validated_data):
        parent_id = validated_data.pop('parent', None)
        instance.name = validated_data.get('name', instance.name)
        if parent_id == -1:
            instance.parent_category = None
        elif parent_id:
            parent_category = Category.objects.get(id=parent_id)
            instance.parent_category = parent_category
        instance.save()
        return instance


"""class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Category
        fields = ("name", "parent")

    def update(self, instance, validated_data):
        parent_id = validated_data.pop('parent', None)
        instance.name = validated_data.get('name', instance.name)

        if parent_id == -1:
            instance.parent_category = None
        elif parent_id:
            parent_category = Category.objects.get(id=parent_id)
            instance.parent_category = parent_category
        instance.save()
        return instance"""



class ScriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Script
        fields = ["name", "file", "category", "output_type", "description"]

    def __init__(self, *args, **kwargs):
        super(ScriptSerializer, self).__init__(*args, **kwargs)
        if self.instance:  # Check if the serializer is used for updating
            self.fields['file'].required = False
            self.fields['output_type'].required = False

    def validate(self, data):
        """
        Ensure that the file and output_type are not required on update if they are not provided.
        """
        if self.instance:
            if 'file' not in data and not self.instance.file:
                raise serializers.ValidationError({"file": "This field is required."})
            if 'output_type' not in data and not self.instance.output_type:
                raise serializers.ValidationError({"output_type": "This field is required."})
        return data
