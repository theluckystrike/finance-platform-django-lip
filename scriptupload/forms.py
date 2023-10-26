"""
Configuration for the forms that appear on the site.

These classes are imported and used in other python files, which allows them to show up
on the screen for us to interact with.

Each class controls a different form and has different config for what to do when interacted with.
"""

from django import forms
from .models import Script, ScriptCategory


class ScriptUploadForm(forms.ModelForm):
    category_name = forms.CharField(max_length=100)

    class Meta:
        model = Script
        fields = ("name", "file", "image", "category_name")


class NewScriptCategory(forms.ModelForm):
    parent = forms.IntegerField()
    class Meta:
        model = ScriptCategory
        fields = ("name",)


class ScriptAddCategoryForm(forms.Form):
    category_name = forms.IntegerField()
        