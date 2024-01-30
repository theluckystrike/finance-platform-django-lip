"""
Configuration for uploading new scripts to the project.
"""

from django.apps import AppConfig
from concurrent.futures import ThreadPoolExecutor


class ScriptuploadConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'scriptupload'

    def ready(self):
        import scriptupload.signals
        self.executor = ThreadPoolExecutor(max_workers=1)
