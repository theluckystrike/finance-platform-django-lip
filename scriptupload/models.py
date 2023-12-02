"""
Configuration for storing scripts in a database.

The text inside the brackets on each line (for example, (max_length=100, unique=True)) are setting defaults for those values.
If they are not passed when the code is called, whatever value comes after the equals symbol will be used.

Reference: https://docs.djangoproject.com/en/4.2/topics/db/examples/many_to_many/
"""

from django.db import models
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from django.conf import settings
from .signals import delete_script_files, save_script, save_report

# This line configures which type of storage to use.
# If the setting "USE_S3" is true, PrivateMediaStorage will be used. If it is false, default_storage will be used.
privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage


def script_file_path(instance, filename):
    """
    A getter method for the path to the scripts.
    """
    return f"scripts/{instance.name}/{filename}"


def report_file_path(instance, filename):
    return f"reports/{instance.name}/{filename}"


class Category(models.Model):
    """
    Config for the category of a new script.

    The result of this is used to set the script category in the database.
    """
    name = models.CharField(max_length=100, unique=True)
    parent_category = models.ForeignKey(
        'self', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class Script(models.Model):
    """
    Configures all information about a new script when a new script is uploaded.

    Values that are used here are what will be stored in the database.
    """
    name = models.CharField(max_length=100, unique=True)
    # TODO rename and refactor "file"
    file = models.FileField(upload_to=script_file_path,
                            storage=privateStorage, max_length=200)
    image = models.ImageField(
        blank=True, upload_to=script_file_path, storage=privateStorage,
        max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Script"
        verbose_name_plural = "Scripts"


class Report(models.Model):
    """
    Reports that have several script in them for generating
    pdf reports
    """
    name = models.CharField(max_length=100, unique=True)
    scripts = models.ManyToManyField(Script)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    latest_pdf = models.FileField(
        upload_to=report_file_path, storage=privateStorage, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Report"
        verbose_name_plural = "Reports"


class ReportEmailTask(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    email = models.EmailField(max_length=254)
    day = models.CharField(max_length=1)

    def __str__(self):
        return f"{self.report.name}-{self.day}"


delete_script_files(Script)
save_script(Script)
save_report(Report)
