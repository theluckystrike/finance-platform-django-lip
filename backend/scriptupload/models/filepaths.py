import os
from django.conf import settings


def script_file_path(instance, filename):
    """
    A getter method for the path to the scripts.
    """
    if settings.DEBUG:
        directory_name = "scripts-dev"
    else:
        directory_name = "scripts"
    return os.path.join(directory_name, instance.name, filename)


def table_file_path(instance, filename):
    if settings.DEBUG:
        directory_name = "scripts-dev"
    else:
        directory_name = "scripts"
    return os.path.join(directory_name, instance.script.name, "table", filename)


def chart_file_path(instance, filename):
    if settings.DEBUG:
        directory_name = "scripts-dev"
    else:
        directory_name = "scripts"
    return os.path.join(directory_name, instance.script.name, "chart", filename)


def report_file_path(instance, filename):
    if settings.DEBUG:
        directory_name = "reports-dev"
    else:
        directory_name = "reports"
    return os.path.join(directory_name, instance.name, filename)
