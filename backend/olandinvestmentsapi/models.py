from django.db import models
from django.contrib.auth.models import User
from scriptupload.models import Script

# Create your models here.


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
