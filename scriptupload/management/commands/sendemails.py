from django.core.management.base import BaseCommand
from django.core.mail import EmailMessage
from scriptupload.models import ReportEmailTask
from scriptupload.utils import update_report_pdf
from datetime import datetime
import logging
from django.conf import settings


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""
logger = logging.getLogger(__name__)


def send_pdf(task):
    update_report_pdf(task.report)
    today_str = datetime.today().strftime("%A")
    mail = EmailMessage(
        f"{task.report.name} Scheduled Report {datetime.now().strftime('%Y/%m/%d')}",
        f"Report: {task.report.name}\nSchedule: {'Daily' if task.day == '*' else f'Every {today_str}'}\n\nPlease find your report attached.\n\n",
        f"Financial-Reports-No-reply <{settings.EMAIL_HOST_USER}>",
        [task.email]
    )
    mail.attach(f"{task.report.name}_{datetime.now().strftime('%Y_%m_%d')}.pdf",
                task.report.latest_pdf.read(), "application/pdf")
    mail.send(fail_silently=False)


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
        today_full = datetime.today().strftime('%d-%m-%Y')
        tasks = ReportEmailTask.objects.all()
        num_tasks = len(tasks)
        logger.info(
            f"[email sender] Sending all emails for today {today_full}")
        for i, task in enumerate(tasks):
            if task.day == "*" or int(task.day) == today:
                send_pdf(task)
                logger.info(
                    f"[email sender] {i+1}/{num_tasks} -> Sent email to {task.email} for day {task.day} on day {today}")
        logger.info(
            f"[email sender] Finished sending all emails for {today_full}")
