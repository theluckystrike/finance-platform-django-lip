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
privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage
# This line configures which type of storage to use.
# If the setting "USE_S3" is true, PrivateMediaStorage will be used. If it is false, default_storage will be used.


def rm(directory, storage=privateStorage):
    if directory.replace("/", "") in ["private", "scripts-dev", "reports-dev", "scripts", "reports", ""]:
        logger.error(
            f"[rm util] Attempted to delete directory '{directory}' - ABORTED")
        return
    dirs, files = storage.listdir(directory)
    for file in files:
        filepath = os.path.join(directory, file)
        storage.delete(filepath)
    for dir in dirs:
        dirpath = os.path.join(directory, dir)
        rm(dirpath, storage)
    logger.info(f"[rm util] Deleted directory '{directory}'")


def script_signals(Script):
    """
    Deletes a file from the database, if it exists, and delete any empty directory that may be left.

    :param Script: The script that is to be deleted.
    :return: None.
    """
    @receiver(post_delete, sender=Script, weak=False)
    def delete_files(sender, instance, **kwargs):
        # parent_dir = os.path.dirname(instance.file.name)
        # rm(parent_dir, privateStorage)
        instance.file.delete(save=False)
        instance.image.delete(save=False)
        logger.info(
            f"[script post delete signal] Cleaned up files for script * {instance.name} * after deletion")


def report_signals(Report):

    @receiver(post_delete, sender=Report, weak=False)
    def cleanup_storage_files(sender, instance, **kwargs):
        parent_dir = os.path.dirname(instance.latest_pdf.name)
        rm(parent_dir, privateStorage)
        logger.info(
            f"[report post delete signal] Cleaned up directory {parent_dir} for report * {instance.name} * after deletion")
