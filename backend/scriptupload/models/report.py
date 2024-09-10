import logging
from django.db import models
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from django.conf import settings
from django.utils import timezone
from ..signals import report_signals
from django.contrib.auth.models import User
from .filepaths import report_file_path
from .script import Script
from ..utils.utils import scripts_to_pdf
import django_rq
import time

# This line configures which type of storage to use.
# If the setting "USE_S3" is true, PrivateMediaStorage will be used. If it is false, default_storage will be used.
privateStorage = PrivateMediaStorage() if settings.USE_S3 else default_storage
logger = logging.getLogger('testlogger')


class Report(models.Model):
    """
    Reports that have several script in them for generating
    pdf reports
    """
    name = models.CharField(max_length=100, unique=True)
    scripts = models.ManyToManyField(Script)
    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    latest_pdf = models.FileField(
        upload_to=report_file_path, storage=privateStorage, blank=True)
    status = models.CharField(max_length=15, default="success")
    added_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)

    # TODO: Execution status like in Script model

    def __str__(self):
        return self.name

    def set_status(self, status):
        self.status = status
        self.save(update_fields=["status"])

    def _update(self, runscripts=False, base_url=None):
        try:
            pfd_file = scripts_to_pdf(
                self.scripts.all().order_by("index_in_category"), self.name, base_url)
            self.latest_pdf.save(
                f"{self.name}.pdf", pfd_file)
            self.last_updated = timezone.now()
            self.set_status("success")
            logger.info(
                f"[report update] Successfully updated report * {self.name} *")
        except Exception as e:
            self.set_status("failure")
            logger.error(
                f"[report update] Failed to update report * {self.name} * with error ->\n{str(e)}")

        self.save()

    def update(self, runscripts=False, base_url=None, wait=False):
        q = django_rq.get_queue("reports")
        job = q.enqueue(self._update, runscripts, base_url)
        self.set_status('running')
        # possible values are queued, started, deferred, finished, stopped, scheduled, canceled and failed
        if wait:
            while job.get_status(refresh=True) in ["queued", "started"]:
                time.sleep(5)

    class Meta:
        verbose_name = "Report"
        verbose_name_plural = "Reports"


class ReportEmailTask(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    email = models.EmailField(max_length=254)
    day = models.CharField(max_length=1)

    def __str__(self):
        return f"{self.report.name}-{self.day}"


def merge_reports(report1: Report, report2: Report, user: User, name: str):
    logger.debug(
        f"[report merge] Merging reports '{report1.name}' and '{report2.name}'")
    r1c = report1.scripts.count()
    r2c = report2.scripts.count()
    if r1c == 0 or r2c == 0:
        logger.debug(
            f"[report merge] Reports '{report1.name}' ({r1c} scripts) and '{report2.name}' ({r2c} scripts) cannot be merged")
        return False
    if report1 == report2:
        logger.debug(
            f"[report merge] Cannot merge report '{report1.name}' ({r1c} scripts) with itself")
        return False
    merged_scripts_list = report1.scripts.all() | report2.scripts.all()
    new_report = Report(added_by=user, name=name)
    new_report.save()
    new_report.scripts.set(merged_scripts_list)
    logger.debug(
        f"[report merge] Successfully merged reports '{report1.name}' ({r1c} scripts) and '{report2.name}' ({r2c} scripts)")
    return True


report_signals(Report)
