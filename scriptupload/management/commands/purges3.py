from django.core.management.base import BaseCommand
from scriptupload.models import Script, Report
import logging
from django.conf import settings
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from scriptupload.signals import rm
import os


logger = logging.getLogger('testlogger')
storage = PrivateMediaStorage() if settings.USE_S3 else default_storage


class Command(BaseCommand):
    help = "Purge s3 bucket of all scripts and reports not belonging to a database item"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """

        if not settings.IS_HEROKU:
            logger.error(
                "[purge s3] Trying to purge S3 bucket from non-deployment instance")
            return
        scripts = Script.objects.all()
        reports = Report.objects.all()

        script_names = [s.name for s in scripts]
        report_names = [r.name for r in reports]

        s3_script_dirs, _ = storage.listdir("scripts")
        s3_report_dirs, _ = storage.listdir("reports")

        scripts_to_delete = [
            os.path.join("scripts", dir) for dir in s3_script_dirs if dir not in script_names]
        reports_to_delete = [
            os.path.join("reports", dir) for dir in s3_report_dirs if dir not in report_names]

        logger.info(
            f"[purge s3] Purging {len(scripts_to_delete)} scripts and {len(reports_to_delete)} reports from storage")
        for scriptdir in scripts_to_delete:
            rm(scriptdir, storage)
        for reportdir in reports_to_delete:
            rm(reportdir, storage)
        logger.info(f"[purge s3] Completed purging")
