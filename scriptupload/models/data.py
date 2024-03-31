from django.db import models
from .filepaths import table_file_path, chart_file_path
from django.core.files.storage import default_storage
from django.utils import timezone
from financeplatform.storage_backends import PrivateMediaStorage
from django.conf import settings
from ..signals import chart_data_signals, table_data_signals

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

    def set_last_updated(self):
        self.last_updated = timezone.now()
        self.save(update_fields=["last_updated"])

    def __str__(self):
        return f"{self.script.name} - Table Data"

    class Meta:
        verbose_name = "Table Data"
        verbose_name_plural = "Table Data"


class ChartData(models.Model):
    image_file = models.FileField(upload_to=chart_file_path,
                                  storage=privateStorage, max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    script = models.OneToOneField(
        'Script', on_delete=models.CASCADE, related_name="chart_data", null=True, blank=True)

    def set_last_updated(self):
        self.last_updated = timezone.now()
        self.save(update_fields=["last_updated"])

    def __str__(self):
        return f"{self.script.name} - Chart Data"

    class Meta:
        verbose_name = "Chart Data"
        verbose_name_plural = "Chart Data"


chart_data_signals(ChartData)
table_data_signals(TableData)
