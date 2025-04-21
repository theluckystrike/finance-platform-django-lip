from django.core.management.base import BaseCommand
from olandinvestmentsapi.models import Summary
import logging
from django.utils import timezone


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""
logger = logging.getLogger('testlogger')


class Command(BaseCommand):
    help = "Update all reports without running their scripts"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        today_full = timezone.now().strftime('%d-%m-%Y')

        logger.info(
            f"[reports updater] Updating all Summaries on {today_full}")
        for summary in Summary.objects.all():
            summary.update()
        logger.info(
            f"[reports updater] Finished adding all summaries to the task queue")
