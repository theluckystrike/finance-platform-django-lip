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
        fields = ("name", "file", "category", "output_type")

    def __init__(self, *args, **kwargs):
        super(ScriptUploadForm, self).__init__(*args, **kwargs)
        if self.instance.pk:  # Check if the form is used for updating
            self.fields['file'].required = False
            self.fields['output_type'].required = False


class NewCategoryForm(forms.ModelForm):
    parent = forms.IntegerField()

    class Meta:
        model = Category
        fields = ("name",)


class NewReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = ("name", "scripts",)


class MergeReportsForm(forms.Form):
    new_report_name = forms.CharField(label="New Report Name", max_length=1000)
    report1 = forms.ModelChoiceField(queryset=Report.objects.all(), label='Report 1')
    report2 = forms.ModelChoiceField(queryset=Report.objects.all(), label='Report 2')


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
