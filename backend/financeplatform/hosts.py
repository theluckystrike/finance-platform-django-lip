from django_hosts import patterns, host
from django.conf import settings


host_patterns = patterns('',
                         host(r'www', settings.ROOT_URLCONF, name='www'),
                         host(r'api', 'financeplatform.api_urls', name='api'),
                         host(r'admin', 'financeplatform.admin_urls', name='admin'),
                         host(r'', settings.ROOT_URLCONF, name='default'),  # Fallback for root domain
                         )
