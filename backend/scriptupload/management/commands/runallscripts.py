from django.core.management.base import BaseCommand
from scriptupload.models import Script
from scriptupload.utils.runners import run_script
import logging


logger = logging.getLogger('testlogger')


class Command(BaseCommand):
    help = "Run and update all scripts in the database"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        logger.info(
            "[all script runner] Starting to run all scripts on scheduled job")
        for script in Script.objects.all():
            run_script(script)
        logger.info(
            "[all script runner] Finished running all scripts on scheduled job")
