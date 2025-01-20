from django.core.management.base import BaseCommand
from scriptupload.models import Script
from django.utils import timezone
from django.db.models import Q
import logging


logger = logging.getLogger('testlogger')


class Command(BaseCommand):
    help = "Run and update all scripts in the database"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        parser.add_argument("-b", dest="batch_size",
                            default=10, type=int, action='store')

    def handle(self, *args, **options):
        batch_size = options["batch_size"]
        twenty_four_hours_ago = timezone.now() - timezone.timedelta(hours=24)

        logger.info(
            f"[batch script runner] Starting to run a batch of {batch_size} scripts on scheduled job")

        scripts_to_run = Script.objects.filter(
            Q(last_updated__lt=twenty_four_hours_ago) | Q(
                last_updated__isnull=True)
        )[:batch_size]
        for script in scripts_to_run:
            script.run()
            logger.info(
                f"[batch script runner] Ran script '{script.name}' id={script.id}")

        logger.info(
            "[batch script runner] Finished running a batch of scripts on scheduled job")
