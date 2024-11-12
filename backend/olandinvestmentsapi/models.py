from django.db import models
from django.contrib.auth.models import User
from scriptupload.models import Script
from scriptupload.utils.summary import make_summary_table
import django_rq
from django.utils.translation import gettext_lazy as _
import time
import logging
import traceback
import sys

logger = logging.getLogger('testlogger')

# Create your models here.


class Status(models.IntegerChoices):
    SUCCESS = 0, _("success")
    RUNNING = 1, _("running")
    FAILURE = 2, _("failure")


class Summary(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    # last_updated = models.DateTimeField()
    # timeseries_symbol = models.CharField()
    # timeseries_start_date = models.DateField()
    # timeseries_end_date = models.DateField(null=True, blank=True)
    '''
    meta = {
        scripts: {
            script1_id: {
                "name": "Script1 name",
                "column_name": "col x signal",
                "column_last_value": -1
            },
            . . . 
        
        }
    }
    '''
    meta = models.JSONField(default=dict, blank=False, null=False)
    # M2M for access to script data
    scripts = models.ManyToManyField(Script, related_name="summaries")
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.IntegerField(
        choices=Status.choices, default=Status.SUCCESS)

    signal_plot_data = models.JSONField(blank=True, null=True)

    def set_status(self, status):
        self.status = status
        self.save(update_fields=["status"])

    def _update(self):
        try:
            summary_json, meta = make_summary_table(self)
            self.meta['scripts'] = meta
            self.signal_plot_data = summary_json
            self.save(update_fields=["meta", "signal_plot_data"])
            self.set_status(Status.SUCCESS)
            logger.info(
                f"[report update] Successfully updated report {self.id}")
        except Exception as e:
            exc_info = sys.exc_info()
            exc_str = "".join(traceback.format_exception(*exc_info))
            logger.error(
                f"[summary update] Failed to update summary {self.id} with error ->\n{exc_str}")
            self.set_status(Status.FAILURE)

    def update(self, wait=False):
        q = django_rq.get_queue("summaries")
        self.set_status(Status.RUNNING)
        job = q.enqueue(self._update)
        if wait:
            while job.get_status(refresh=True) in ["queued", "started"]:
                time.sleep(5)
        return job

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Summary"
        verbose_name_plural = "Summaries"
