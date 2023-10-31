"""
Configuration for storing scripts in a database.

The text inside the brackets on each line (for example, (max_length=100, unique=True)) are setting defaults for those values.
If they are not passed when the code is called, whatever value comes after the equals symbol will be used.
"""

from django.db import models
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from django.conf import settings
from .signals import delete_script_files, save_script
from datetime import datetime

# This line configures which type of storage to use.
# If the setting "USE_S3" is true, PrivateMediaStorage will be used. If it is false, default_storage will be used.
privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage


def script_file_path(instance, filename):
    """
    A getter method for the path to the scripts.
    """
    return f"scripts/{instance.name}/{filename}"


class ScriptCategory(models.Model):
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
    file = models.FileField(upload_to=script_file_path, storage=privateStorage)
    image = models.ImageField(
        blank=True, upload_to=script_file_path, storage=privateStorage)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    categories = models.ManyToManyField(ScriptCategory)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Script"
        verbose_name_plural = "Scripts"


class OHLCData(models.Model):
    """
    Open, high, low, close data
    """
    ticker = models.CharField(max_length=5)
    date = models.DateTimeField()
    open = models.DecimalField(max_digits=19, decimal_places=4)
    high = models.DecimalField(max_digits=19, decimal_places=4)
    low = models.DecimalField(max_digits=19, decimal_places=4)
    close = models.DecimalField(max_digits=19, decimal_places=4)
    volume = models.BigIntegerField()

    class Meta:
        verbose_name = "OHLC Data"
        verbose_name_plural = "OHLC Data"

    def __str__(self):
        return f"{self.ticker}-{datetime.strftime(self.date, r'%Y-%m-%d')}"


class IndexConstituents(models.Model):
    index = models.CharField(max_length=5)
    ticker = models.CharField(max_length=5)
    date_added = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = "Index Constituent"
        verbose_name_plural = "Index Constituents"

    def __str__(self):
        return f"{self.ticker}-{self.index}"


class IndexActions(models.Model):
    index = models.CharField(max_length=5)
    ticker = models.CharField(max_length=5)
    date = models.DateTimeField()
    name = models.CharField(max_length=7)  # (added, removed)

    class Meta:
        verbose_name = "Index Action"
        verbose_name_plural = "Index Actions"

    def __str__(self):
        return f"{self.ticker}-{self.index}"


# set signals
delete_script_files(Script)
save_script(Script)
