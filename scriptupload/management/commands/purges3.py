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
    help = "Purge S3 bucket of all scripts and reports not belonging to a database item"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """

        if settings.DEBUG:
            # return
            scriptsdir = "scripts-dev"
            reportsdir = "reports-dev"
        else:
            scriptsdir = "scripts"
            reportsdir = "reports"
        logger.info(
            f"[purge S3] Purging '{scriptsdir}' and '{reportsdir}' directories in S3 bucket")



        scripts = Script.objects.all()
        reports = Report.objects.all()

        script_names = [os.path.dirname(s.file.name) for s in scripts]
        report_names = [os.path.dirname(r.latest_pdf.name) for r in reports]

        S3_script_dirs, _ = storage.listdir(scriptsdir)
        S3_report_dirs, _ = storage.listdir(reportsdir)

        S3_script_dirs = [os.path.join(scriptsdir, s) for s in S3_script_dirs]
        S3_report_dirs = [os.path.join(reportsdir, s) for s in S3_report_dirs]

        scripts_to_delete = [
            dir for dir in S3_script_dirs if dir not in script_names]
        reports_to_delete = [
            dir for dir in S3_report_dirs if dir not in report_names]

        print("\nWant to delete the following:\n")
        print("  Scripts:")
        for script in scripts_to_delete:
            print(f"    - {script}")
        print("\n  Reports:")
        for report in reports_to_delete:
            print(f"    - {report}")
        proceed = input("\nDo you wish to proceed? [y/n]  ")
        if proceed == "y":
            logger.info(
                f"[purge S3] Purging {len(scripts_to_delete)} scripts and {len(reports_to_delete)} reports from storage")
            for scriptdir in scripts_to_delete:
                rm(scriptdir, storage)
            for reportdir in reports_to_delete:
                rm(reportdir, storage)
        logger.info(f"[purge S3] Completed purging")
