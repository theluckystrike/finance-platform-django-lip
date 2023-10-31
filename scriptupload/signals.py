"""
Configuration for saving/deleting a script from the database.
"""

from django.dispatch import receiver
from django.db.models.signals import pre_delete, pre_save
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from django.conf import settings
import os
from datetime import datetime

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
        # check if image file exists and delete it
        if instance.image.name:
            if storage.exists(instance.image.name):
                storage.delete(instance.image.name)
        # delete empty directory
        dir_to_remove = os.path.dirname(instance.file.name)
        storage.delete(dir_to_remove)


def save_script(Script):
    """
    Saves a new script to the database.

    :param Script: The script that is to be added.
    :return: None.
    """
    @receiver(pre_save, sender=Script, weak=False)
    def update_last_updated(sender, instance, **kwargs):
        instance.last_updated = datetime.now()
