from django.core.management.base import BaseCommand
from scriptupload.models import Script
from scriptupload.utils import run_script
import logging


logger = logging.getLogger('testlogger')


class Command(BaseCommand):
    help = "Send scheduled emails"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """
        logger.info(
            "[all script runner] Starting to run all scripts on scheduled job")
        for script in Script.objects.all():
            succ, strace = run_script(script)
            if succ is False:
                logger.error(
                    f"[all script runner] Failed to run script * {script.name} * ->\n{strace}")
            else:
                logger.info(
                    f"[all script runner] Successfully ran script * {script.name} *")
        logger.info(
            "[all script runner] Finished running all scripts on scheduled job")
