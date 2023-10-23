from django.apps import AppConfig


class ScriptuploadConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'scriptupload'

    def ready(self):
        import scriptupload.signals
