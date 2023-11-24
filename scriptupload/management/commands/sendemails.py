from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from scriptupload.models import ReportEmailTask, Report
from datetime import datetime


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""


class Command(BaseCommand):
    help = "Send scheduled emails"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """
        today = datetime.weekday(datetime.today()) + 1
        tasks = ReportEmailTask.objects.all()
        for task in tasks:
            if task.day == "*" or int(task.day) == today:
                send_mail(
                    f"Scheduled report - {task.report.name}",
                    "[report pdf]",
                    "financialreports12@outlook.com",
                    [task.email],
                    fail_silently=False
                )
