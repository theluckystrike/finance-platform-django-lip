from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger('testlogger')


class HealthCheckMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.META['PATH_INFO'] == '/ping/':
            logger.info(f"[Health Check] Received health check")
            return HttpResponse('pong!')
