from io import BytesIO
from django.core.management.base import BaseCommand
from django.core.mail import EmailMessage
from scriptupload.models import ReportEmailTask
from scriptupload.utils import run_script
from datetime import datetime
import logging
from django.conf import settings
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""
logger = logging.getLogger(__name__)


def send_pdf(task):
    storage = PrivateMediaStorage() if settings.USE_S3 else default_storage
    # get urls of each script image
    scripts = task.report.scripts.all()
    for script in scripts:
        # if not script.image:
        run_script(script)
    image_paths = [
        storage.url(script.image.name) for script in scripts
        if script.image.name != "" and script.image is not None
    ]
    if len(image_paths) == 0:
        return None
    # open a buffer so that files are saves to temporary memory
    buffer = BytesIO()
    # set the title of the pdf
    title_text = f"{task.report.name}"

    c = canvas.Canvas(buffer, pagesize=A4)
    c.setFont("Helvetica-Bold", 18)
    title_width = c.stringWidth(title_text, "Helvetica-Bold", 18)
    page_width, page_height = A4
    x = (page_width - title_width) / 2
    y = page_height - 50
    c.drawString(x, y, title_text)

    # add the images to the pdf
    x, y = 50, 500
    for i in range(len(image_paths)):
        if i % 2 == 0 and i != 0:
            y = 500
            c.showPage()
        c.drawImage(image_paths[i], x, y, width=500, height=250)
        y -= 300
    # save to buffer
    c.save()
    # reset the buffer position
    buffer.seek(0)
    mail = EmailMessage(
        f"{task.report.name} Report {datetime.now().strftime('%Y/%m/%d')}",
        "Please find todays's report from - {task.report.name} - attached.\n",
        f"Finacnce-Reports-No-reply <{settings.EMAIL_HOST_USER}>",
        [task.email]
    )
    mail.attach(f"{task.report.name}_{datetime.now().strftime('%Y_%m_%d')}.pdf",
                buffer.read(), "application/pdf")
    mail.send(fail_silently=False)
    buffer.close()


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
            # print(today, task.day)
            if task.day == "*" or int(task.day) == today:
                send_pdf(task)
                logger.info(
                    f"Sent email to {task.email} for day {task.day} on day {today}")
                print(
                    f"Sent email to {task.email} for day {task.day} on day {today}")
