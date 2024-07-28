"""
Configuration for uploading new scripts to the project.
"""

from django.apps import AppConfig
import sys
import logging
logger = logging.getLogger('testlogger')


class ScriptuploadConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'scriptupload'

    def ready(self):
        import scriptupload.signals
        # execute only if not running migrations
        if 'migrate' not in sys.argv and 'makemigrations' not in sys.argv:
            from .models import Report, Script
            # reset runs that were interrupted by crash or other
            logger.info(
                f"[ScriptuploadConfig] Resetting interrupted runs. Argv was {sys.argv}")
            for report in Report.objects.filter(status="running"):
                report.status = "success"
                report.save(update_fields=["status"])
            for script in Script.objects.filter(status=Script.ExecutionStatus.RUNNING):
                script.set_status(Script.ExecutionStatus.FAILURE,
                                  "Please try again")
            logger.info(
                f"[ScriptuploadConfig] Resetting interrupted runs done.")
