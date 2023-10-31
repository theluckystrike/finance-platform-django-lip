from django.db import models
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from django.conf import settings
from .signals import delete_script_files, save_script

privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage


def script_file_path(instance, filename):
    return f"scripts/{instance.name}/{filename}"


class ScriptCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    parent_category = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)
    
    def __str__(self):
        return self.name


class Script(models.Model):
    name = models.CharField(max_length=100, unique=True)
    file = models.FileField(upload_to=script_file_path, storage=privateStorage)
    image = models.ImageField(blank=True, upload_to=script_file_path, storage=privateStorage)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    categories = models.ManyToManyField(ScriptCategory)

    def __str__(self):
        return self.name


# set signals
delete_script_files(Script)
save_script(Script)




