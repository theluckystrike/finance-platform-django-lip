from django_hosts import patterns, host
from django.conf import settings
from django.contrib import admin


host_patterns = patterns('',
    host(r'www.', settings.ROOT_URLCONF, name='www'),
    host(r'api', 'olandinvestmentsapi.urls', name='api'),
    host(r'admin', 'financeplatform.admin_urls', name='admin'),
)