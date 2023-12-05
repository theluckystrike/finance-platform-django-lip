"""
Configuration for saving/deleting a script from the database.
"""

from django.dispatch import receiver
from django.db.models.signals import pre_delete, pre_save, m2m_changed, post_save
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from django.conf import settings
import os
from datetime import datetime
from .utils import update_report_pdf
from datetime import datetime
import logging


logger = logging.getLogger(__name__)

# This line configures which type of storage to use.
# If the setting "USE_S3" is true, PrivateMediaStorage will be used. If it is false, default_storage will be used.
privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage


def delete_script_files(Script):
    """
    Deletes a file from the database, if it exists, and delete any empty directory that may be left.

    :param Script: The script that is to be deleted.
    :return: None.
    """
    @receiver(pre_delete, sender=Script, weak=False)
    def delete_files(sender, instance, **kwargs):
        storage = privateStorage
        # check if script file exists and delete it
        if instance.file.name:
            if storage.exists(instance.file.name):
                storage.delete(instance.file.name)
                logger.info(
                    f"[script pre delete signal] Deleted chart file for {instance.name}")
        # check if image file exists and delete it
        if instance.image.name:
            if storage.exists(instance.image.name):
                storage.delete(instance.image.name)
                logger.info(
                    f"[script pre delete signal] Deleted image file for {instance.name}")
        # delete empty directory
        dir_to_remove = os.path.dirname(instance.file.name)
        storage.delete(dir_to_remove)


# def save_script(Script):
#     """
#     Saves a new script to the database.

#     :param Script: The script that is to be added.
#     :return: None.
#     """
#     @receiver(pre_save, sender=Script, weak=False)
#     def update_last_updated(sender, instance, **kwargs):
#         instance.last_updated = datetime.now()


def save_report(Report):

    @receiver(m2m_changed, sender=Report.scripts.through, weak=False)
    def update_scripts_report(sender, instance, **kwargs):
        scripts = instance.scripts.all()
        if len(scripts) > 0:
            update_report_pdf(instance)
            logger.info(
                f"[report m2m signal] Updated pdf for report * {instance.name} *")

    @receiver(post_save, sender=Report, weak=False)
    def update_last_updated(sender, instance, **kwargs):
        instance.last_updates = datetime.now()
