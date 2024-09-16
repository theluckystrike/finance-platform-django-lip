"""
WSGI config for financeplatform project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

"""import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'financeplatform.settings')

application = get_wsgi_application()"""

import os
import sys
path=r'/home/mspl/Music/script/finance-platform-django/backend/financeplatform/'
if path not in sys.path:
    sys.path.append(path)
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'financeplatform.settings')
application = get_wsgi_application()
