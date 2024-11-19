from django.apps import AppConfig
import sys
import logging


class OlandinvestmentsapiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'olandinvestmentsapi'

    def ready(self):
        # execute only if not running migrations
        if all([x not in sys.argv for x in ['migrate', 'makemigrations', 'collectstatic']]):
            from .models import Summary, Status
            # reset runs that were interrupted by crash or other
            # logger.info(
            #     f"[ScriptuploadConfig] Resetting interrupted runs. Argv was {sys.argv}")
            for summary in Summary.objects.filter(status=Status.RUNNING):
                summary.set_status(Status.FAILURE)

            # logger.info(
            #     f"[ScriptuploadConfig] Resetting interrupted runs done.")
