from django.db import models

# Create your models here.


# class Summary(models.Model):
#     name = models.CharField()
#     created = models.DateTimeField(auto_now_add=True)
#     last_updated = models.DateTimeField()
#     timeseries_symbol = models.CharField()
#     timeseries_start_date = models.DateField()
#     timeseries_end_date = models.DateField(null=True, blank=True)
#     # M2M for access to script data
#     scripts = models.ManyToManyField()
#     # M2M to table_data for direct access
#     table_data = models.ManyToManyField()
#     # script_columns_names = ?
#     criteria_value = models.FloatField()
#     # Foreign key to user who made this summary
#     created_by = models.ForeignKey()
