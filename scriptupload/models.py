from django.db import models
from datetime import datetime

# Create your models here.

def script_file_path(instance, filename):
    return f"scripts/{instance.name}/{filename}"


class Script(models.Model):
    name = models.CharField(max_length=100, unique=True)
    file = models.FileField(upload_to=script_file_path)
    image = models.FileField(blank=True, upload_to=script_file_path)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        self.last_updated = datetime.now()
        super().save(*args, **kwargs)