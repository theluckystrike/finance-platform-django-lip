from django import forms
from .models import Script, ScriptCategory


class ScriptUploadForm(forms.ModelForm):
    category_name = forms.CharField(max_length=100)

    class Meta:
        model = Script
        fields = ("name", "file", "image", "category_name")


class NewScriptCategory(forms.ModelForm):
    class Meta:
        model = ScriptCategory
        fields = ("name",)