#!/usr/bin/env python
"""
This file is the entry point for the project. It does some configuration before calling a django function and allowing
it to run the project.
"""
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    # Set a default value for the DJANGO_SETTINGS_MODULE environment variable.
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'financeplatform.settings')

    # Try to import the required function from django.
    try:
        from django.core.management import execute_from_command_line
    # Catch the error that will be thrown if the import fails and display a custom error message.
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # Call the Django function that was just imported using the arguments passed into the program.
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    # This if statement is the first thing to be run when the project is started.
    # It will run the 'main()' function above, which will then run the rest of the project.
    main()
