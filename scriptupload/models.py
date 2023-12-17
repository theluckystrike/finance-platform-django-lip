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
from .signals import script_signals, report_signals
from .utils import scripts_to_pdfbuffer
from django.core.files import File
import os
from django.utils import timezone

# This line configures which type of storage to use.
# If the setting "USE_S3" is true, PrivateMediaStorage will be used. If it is false, default_storage will be used.
privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage


def script_file_path(instance, filename):
    """
    A getter method for the path to the scripts.
    """
    if settings.DEBUG:
        directory_name = "scripts-dev"
    else:
        print("not dev directory for scripts")
        directory_name = "scripts"
    return os.path.join(directory_name, instance.name, filename)


def report_file_path(instance, filename):
    if settings.DEBUG:
        directory_name = "reports-dev"
    else:
        directory_name = "reports"
    return os.path.join(directory_name, instance.name, filename)


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

    def get_children(self):
        return Category.objects.filter(parent_category=self)

    def get_level(self):
        if not self.parent_category:
            return 0
        elif not self.parent_category.parent_category:
            return 1
        else:
            return 2

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
    last_updated = models.DateTimeField(blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, blank=True, null=True)
    index_in_category = models.IntegerField(blank=True, default=0)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__original_category = self.category

    def save(self, force_insert=False, force_update=False, *args, **kwargs):
        super().save(force_insert, force_update, *args, **kwargs)
        if not self.__original_category and self.category:
            new_category_scripts = self.category.script_set.all().order_by("-index_in_category")
            if len(new_category_scripts) > 0:
                self.index_in_category = new_category_scripts[0].index_in_category + 1
            else:
                self.index_in_category = 0

        elif self.__original_category and self.category and self.category != self.__original_category:
            # update order in old category
            old_category_scripts = self.__original_category.script_set.filter(
                index_in_category__gt=self.index_in_category)
            for script in old_category_scripts:
                script.index_in_category -= 1
                script.save(update_fields=["index_in_category"])

            # set index in new category
            new_category_scripts = self.category.script_set.all().order_by("-index_in_category")
            if len(new_category_scripts) > 0:
                self.index_in_category = new_category_scripts[0].index_in_category + 1
            else:
                self.index_in_category = 0

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
    last_updated = models.DateTimeField(blank=True, null=True)
    latest_pdf = models.FileField(
        upload_to=report_file_path, storage=privateStorage, blank=True)

    def __str__(self):
        return self.name

    def update(self, runscripts=False):
        buffer = scripts_to_pdfbuffer(
            self.scripts.all(), self.name, runscripts)
        self.latest_pdf.save(
            f"{self.name}_report_{timezone.now().strftime('%d_%m_%Y_%H_%M')}.pdf", File(buffer))
        self.last_updated = timezone.now()
        self.save()

    class Meta:
        verbose_name = "Report"
        verbose_name_plural = "Reports"


class ReportEmailTask(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    email = models.EmailField(max_length=254)
    day = models.CharField(max_length=1)

    def __str__(self):
        return f"{self.report.name}-{self.day}"


script_signals(Script)
report_signals(Report)
