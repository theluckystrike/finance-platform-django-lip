"""
Configuration for uploading new scripts to the project.
"""

from django.apps import AppConfig


class ScriptuploadConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'scriptupload'

    def ready(self):
        import scriptupload.signals
        from .models import Report, Script
        # reset runs that were interrupted by crash or other
        for report in Report.objects.filter(status="running"):
            report.status = "success"
            report.save(update_fields=["status"])
        for script in Script.objects.filter(status="running"):
            script.status = "failure"
            script.error_message = "Please try again"
            script.save(update_fields=["status", "error_message"])
