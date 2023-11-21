from django.core.management.base import BaseCommand
from databaseinterface.models import Rate


"""
Define any function you want to keep or run here and then call them from
Command->handle()

From the command line on the server, run 'python manage.py updatedb' to
execute
"""


class Command(BaseCommand):
    help = "Populate database"

    def add_arguments(self, parser):
        # use this if you want to add arguments to the command line
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        """
        Write any code that you want to run on the tables
        in this function only
        """
        Rate.objects.all().delete()
