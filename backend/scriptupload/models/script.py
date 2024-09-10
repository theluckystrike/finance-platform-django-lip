import logging
from django.db import models
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from django.conf import settings
from ..utils.runners import run_script
import os
from django.utils import timezone
from ..signals import rm, script_signals
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from .category import Category
from .data import TableData, ChartData
from .filepaths import script_file_path
from django.urls import reverse
import django_rq
# This line configures which type of storage to use.
# If the setting "USE_S3" is true, PrivateMediaStorage will be used. If it is false, default_storage will be used.
privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage
logger = logging.getLogger('testlogger')


class Script(models.Model):
    """
    Configures all information about a new script when a new script is uploaded.

    Values that are used here are what will be stored in the database.
    """
    name = models.CharField(max_length=100, unique=True)
    # TODO rename and refactor "file"
    file = models.FileField(upload_to=script_file_path,
                            storage=privateStorage, max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, blank=True, null=True)
    index_in_category = models.IntegerField(blank=True, default=0)

    class ExecutionStatus(models.IntegerChoices):
        SUCCESS = 0, _("success")
        RUNNING = 1, _("running")
        FAILURE = 2, _("failure")

    status = models.IntegerField(
        choices=ExecutionStatus.choices, default=ExecutionStatus.SUCCESS)
    error_message = models.TextField(null=True, blank=True, max_length=300)
    added_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)

    description = models.TextField(null=True, blank=True, max_length=300)

    class OutputDataType(models.TextChoices):
        MPL_PYPLT = "plt", _("Chart (using matplotlib.pyplot.savefig())")
        PANDAS = "pd", _("Table (using pandas.Dataframe.to_csv())")
        PD_AND_MPL = "pd plt", _("Chart and Table")

    output_type = models.CharField(
        max_length=10, choices=OutputDataType.choices, default=OutputDataType.MPL_PYPLT)

    def set_status(self, status, error_message: str = ""):
        if status is int and status in self.ExecutionStatus.values:
            new_status = self.ExecutionStatus.choices[status]
        elif status is str and status in self.ExecutionStatus.labels:
            new_status = self.ExecutionStatus.choices[self.ExecutionStatus.labels.index(
                status)]
        else:
            new_status = status
        self.status = new_status
        self.error_message = error_message
        self.save(update_fields=["status", "error_message"])

    def set_last_updated(self):
        self.last_updated = timezone.now()
        self.save(update_fields=["last_updated"])

    def save_table(self, filename: str, file):
        if not filename.endswith(".csv"):
            logger.error(
                f"[script model] Tried to save table with invalid filename: {filename}")
            return
        if not self.has_table_data:
            table_data = TableData(script=self)
            table_data.csv_data.save(filename, file)
            self.table_data = table_data
            table_data.set_last_updated()
            self.save()
        else:
            self.table_data.csv_data.save(filename, file)

    def save_chart(self, filename: str, file):
        if not filename.endswith(".png"):
            logger.error(
                f"[script model] Tried to save chart with invalid filename: {filename}")
            return
        if not self.has_chart_data:
            chart_data = ChartData(script=self)
            chart_data.image_file.save(filename, file)
            chart_data.set_last_updated()
            self.chart_data = chart_data
            self.save()
        else:
            self.chart_data.image_file.save(filename, file)

    @property
    def table_data_file(self):
        return self.table_data.csv_data if self.has_table_data else None

    @property
    def table_data_filename(self):
        return self.table_data.csv_data.name if self.has_table_data else None

    @property
    def chart_image_file(self):
        return self.chart_data.image_file if self.has_chart_data else None

    @property
    def chart_image_filename(self):
        return self.chart_data.image_file.name if self.has_chart_data else None

    @property
    def url(self):
        return reverse('script', args=(self.name,))

    @property
    def has_table_data(self):
        try:
            return self.table_data.csv_data is not None
        # catch exception if table_data does not exist
        except TableData.DoesNotExist:
            logging.debug(
                f"[script model] No table data for script: {self.name}")
            return False

    @property
    def has_chart_data(self):
        try:
            return self.chart_data.image_file is not None
        # catch exception if chart_data does not exist
        except ChartData.DoesNotExist:
            logging.debug(
                f"[script model] No chart data for script: {self.name}")
            return False

    # def update(self):
    #     run_script(self)

    def update_index(self, new_idx):
        """
        Update the index of the script in its current category
        """
        old_idx = self.index_in_category
        if new_idx == old_idx or not self.category:
            return
        if new_idx < 0:
            raise Exception(
                f"Invalid script index in category -> {self.name} with new index {new_idx} from old index {old_idx}")
        if old_idx > new_idx:
            # shift up scripts between new and old
            scripts_to_shift_down = self.category.script_set.filter(
                index_in_category__gt=new_idx-1
            ).filter(
                index_in_category__lt=old_idx
            )
            for script in scripts_to_shift_down:
                script.index_in_category += 1
                script.save(update_fields=['index_in_category'])
        elif old_idx < new_idx:
            # shift down scripts between new and old
            scripts_to_shift_down = self.category.script_set.filter(
                index_in_category__gt=old_idx
            ).filter(
                index_in_category__lt=new_idx+1
            )
            for script in scripts_to_shift_down:
                script.index_in_category -= 1
                script.save(update_fields=['index_in_category'])
        # set new index
        self.index_in_category = new_idx
        self.save(update_fields=["index_in_category"])
        return

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__original_category = self.category
        self.__original_name = self.name

    def save(self, force_insert=False, force_update=False, *args, **kwargs):
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
            logger.info(
                f"[script model] Updated category of script * {self.name} * from '{self.__original_category.name}' to '{self.category.name}'")
        self.__original_category = self.category
        if self.__original_name != self.name and self.__original_name is not None and self.name is not None and self.__original_name != "" and self.name != "":
            self.__original_name = self.name
            original_directory = os.path.dirname(self.file.name)
            self.file.save(os.path.basename(self.file.name), self.file)
            if self.has_chart_data:
                self.save_chart(os.path.basename(
                    self.chart_image_filename), self.chart_image_file)
            if self.has_table_data:
                self.save_table(os.path.basename(
                    self.table_data_filename), self.table_data_file)
            if original_directory != "":
                rm(original_directory)
            logger.info(
                f"[script model] Updated name of script * {self.name} * from '{self.__original_name}' to '{self.name}'")

        super().save(force_insert, force_update, *args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Script"
        verbose_name_plural = "Scripts"

    def run(self):
        q = django_rq.get_queue("scripts")
        job = q.enqueue(run_script, self)
        self.set_status(self.ExecutionStatus.RUNNING)
        return job


script_signals(Script)
