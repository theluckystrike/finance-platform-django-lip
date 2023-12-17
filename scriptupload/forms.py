"""
Configuration for the forms that appear on the site.

These classes are imported and used in other python files, which allows them to show up
on the screen for us to interact with.

Each class controls a different form and has different config for what to do when interacted with.
"""

from django import forms
from .models import Script, Category, Report, ReportEmailTask


class ScriptUploadForm(forms.ModelForm):

    class Meta:
        model = Script
        fields = ("name", "file", "image", "category")


class NewCategoryForm(forms.ModelForm):
    parent = forms.IntegerField()

    class Meta:
        model = Category
        fields = ("name",)


class NewReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = ("name", "scripts",)


class NewReportTaskForm(forms.ModelForm):
    class Meta:
        model = ReportEmailTask
        fields = ("email", "day")


class ScriptSelectForm(forms.Form):
    scripts = forms.ModelMultipleChoiceField(
        queryset=Script.objects.all(),
        widget=forms.CheckboxSelectMultiple
    )
    run_scripts = forms.BooleanField(
        required=False, widget=forms.CheckboxInput)
