from django.contrib.auth.models import User
from rest_framework import serializers
from scriptupload.models import Script


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class ScriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Script
        fields = ["name", "file", "category", "output_type", "description", "id"]
