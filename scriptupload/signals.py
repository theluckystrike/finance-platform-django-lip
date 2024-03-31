"""
Configuration for saving/deleting a script from the database.
"""

from django.dispatch import receiver
from django.db.models.signals import post_delete
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from django.conf import settings
import logging
import os

logger = logging.getLogger('testlogger')
# This line configures which type of storage to use.
# If the setting "USE_S3" is true, PrivateMediaStorage will be used. If it is false, default_storage will be used.
privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage


def rm(directory, storage=privateStorage):
    if any(x in directory for x in ["private", "scripts-dev", "reports-dev", "scripts", "reports", ""]):
        logger.error(
            f"[rm util] Attempted to delete directory '{directory}' - ABORTED")
        return
    dirs, files = storage.listdir(directory)
    for file in files:
        filepath = os.path.join(directory, file)
        storage.delete(filepath)
        logger.info(f"[rm util] Deleted file '{filepath}'")
    for dir in dirs:
        dirpath = os.path.join(directory, dir)
        rm(dirpath, storage)
    logger.info(f"[rm util] Deleted directory '{directory}'")


def chart_data_signals(ChartData):
    @receiver(post_delete, sender=ChartData, weak=False)
    def delete_files(sender, instance, **kwargs):
        if instance.image_file:
            instance.image_file.delete(save=False)
        logger.info(
            "[ChartData post delete signal] Cleaned up files for some chart data")


def table_data_signals(ChartData):
    @receiver(post_delete, sender=ChartData, weak=False)
    def delete_files(sender, instance, **kwargs):
        if instance.csv_data:
            instance.csv_data.delete(save=False)
        logger.info(
            "[TableDAta post delete signal] Cleaned up files for some table data")


def script_signals(Script):
    @receiver(post_delete, sender=Script, weak=False)
    def delete_files(sender, instance, **kwargs):
        if instance.file:
            instance.file.delete(save=False)
            logger.info(
                f"[script post delete signal] Cleaned up code file for script * {instance.name} * after deletion")


def report_signals(Report):

    @receiver(post_delete, sender=Report, weak=False)
    def cleanup_storage_files(sender, instance, **kwargs):
        parent_dir = os.path.dirname(instance.latest_pdf.name)
        rm(parent_dir, privateStorage)
        logger.info(
            f"[report post delete signal] Cleaned up directory {parent_dir} for report * {instance.name} * after deletion")
