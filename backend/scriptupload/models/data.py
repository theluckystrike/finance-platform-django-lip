from django.db import models
from .filepaths import table_file_path, chart_file_path
from django.core.files.storage import default_storage
from django.utils import timezone
from financeplatform.storage_backends import PrivateMediaStorage
from django.conf import settings
from ..signals import chart_data_signals, table_data_signals
from django.core.files import File
from ..utils.utils import csv_to_meta_dict

privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage
# logger = logging.getLogger('testlogger')


class TableData(models.Model):
    csv_data = models.FileField(upload_to=table_file_path,
                                storage=privateStorage, max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    script = models.OneToOneField(
        'Script', on_delete=models.CASCADE, related_name="table_data", null=True, blank=True)
    # add column data or cell data

    table_meta = models.JSONField(default=dict)
    # meta = {
    #     "columns":
    #     [
    #         {
    #             "name": "column name",
    #             "type": "date",
    #             "size": 100
    #         }
    #     ]
    # }

    def set_last_updated(self):
        self.last_updated = timezone.now()
        self.save(update_fields=["last_updated"])

    def save_table(self, filename: str, fileobj: File):
        self.csv_data.save(filename, fileobj)
        self.table_meta = csv_to_meta_dict(self.csv_data)
        self.set_last_updated()
        self.save(update_fields=['csv_data', 'table_meta'])

    def __str__(self):
        return f"{self.script.name} - Table Data"

    class Meta:
        verbose_name = "Table Data"
        verbose_name_plural = "Table Data"


class ChartData(models.Model):
    image_file = models.ImageField(upload_to=chart_file_path,
                                   storage=privateStorage, max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    script = models.OneToOneField(
        'Script', on_delete=models.CASCADE, related_name="chart_data", null=True, blank=True)
    # Can use this if needed :
    # https: // forum.djangoproject.com/t/made-a-compressed-json-field/30044
    # or FileField
    plotly_config = models.JSONField(blank=True, null=True)

    def set_last_updated(self):
        self.last_updated = timezone.now()
        self.save(update_fields=["last_updated"])

    def __str__(self):
        return f"{self.script.name} - Chart Data"

    def save_chart(self, filename: str, fileobj: File):
        self.image_file.save(filename, fileobj)
        self.set_last_updated()
        self.save(update_fields=['image_file'])

    def save_plotly_config(self, config: dict):
        self.plotly_config = config
        self.set_last_updated()
        self.save(update_fields=['plotly_config'])

    class Meta:
        verbose_name = "Chart Data"
        verbose_name_plural = "Chart Data"


chart_data_signals(ChartData)
table_data_signals(TableData)
