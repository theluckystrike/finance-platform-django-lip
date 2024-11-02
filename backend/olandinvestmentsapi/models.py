from django.db import models
from django.contrib.auth.models import User
from scriptupload.models import Script
from scriptupload.utils.summary import make_summary_table
import django_rq
from django.utils.translation import gettext_lazy as _
import time
import logging

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

    def set_status(self, status):
        self.status = status
        self.save(update_fields=["status"])

    def _update(self):
        try:
            summary_df, meta = make_summary_table(self)
            self.meta['scripts'] = meta
            self.save(update_fields=["meta"])
            self.set_status(Status.SUCCESS)
            logger.info(
                f"[report update] Successfully updated report {self.id}")
        except Exception as e:
            logger.error(
                f"[summary update] Failed to update summary {self.id} with error ->\n{str(e)}")
            self.set_status(Status.FAILURE)

    def update(self, wait=False):
        q = django_rq.get_queue("summaries")
        self.set_status(Status.RUNNING)
        job = q.enqueue(self._update)
        if wait:
            while job.get_status(refresh=True) in ["queued", "started"]:
                time.sleep(5)
        return job
