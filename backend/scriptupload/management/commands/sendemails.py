from django.core.management.base import BaseCommand
from django.core.mail import EmailMessage
from scriptupload.models import ReportEmailTask
from datetime import datetime
import logging
from django.conf import settings
from django.utils import timezone


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""
logger = logging.getLogger('testlogger')


def send_pdf(task):
    task.report.update(wait=True)
    today_str = timezone.now().strftime("%A")
    mail = EmailMessage(
        f"{task.report.name} Scheduled Report {timezone.now().strftime('%Y/%m/%d')}",
        f"Report: {task.report.name}\nSchedule: {'Daily' if task.day == '*' else f'Every {today_str}'}\n\nPlease find your report attached.\n\n",
        f'Oland Investments Reports <{settings.DEFAULT_FROM_EMAIL}>',
        [task.email]
    )
    mail.attach(f"{task.report.name}_{timezone.now().strftime('%Y_%m_%d')}.pdf",
                task.report.latest_pdf.read(), "application/pdf")
    mail.send(fail_silently=False)


class Command(BaseCommand):
    help = "Send scheduled emails"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        today = datetime.weekday(timezone.now()) + 1
        today_full = timezone.now().strftime('%d-%m-%Y')
        tasks = ReportEmailTask.objects.all()
        num_tasks = len(tasks)
        logger.info(
            f"[email sender] Sending all emails for today {today_full}")
        for i, task in enumerate(tasks):
            if task.day == "*" or int(task.day) == today:
                try:
                    send_pdf(task)
                    logger.info(
                        f"[email sender] {i+1}/{num_tasks} -> Sent email to {task.email} for day {task.day} on day {today} with report * {task.report.name} *")
                except Exception as e:
                    logger.error(
                        f"[email sender] {i+1}/{num_tasks} -> FAILED to send email with report * {task.report.name} * to {task.email} for day {task.day} on day {today}. Error ->\n{str(e)}")

        logger.info(
            f"[email sender] Finished sending all emails for {today_full}")
