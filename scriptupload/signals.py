from django.dispatch import receiver
from django.db.models.signals import pre_delete, pre_save
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from django.conf import settings
import os
from datetime import datetime

privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage


def delete_script_files(Script):
    @receiver(pre_delete, sender=Script)
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
    @receiver(pre_save, sender=Script)
    def update_last_updated(sender, instance, **kwargs):
        instance.last_updated = datetime.now()
