from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files.storage import default_storage
from .pdf import PDFBuilder
from django.conf import settings
from .utils import get_script_hierarchy


storage = PrivateMediaStorage() if settings.USE_S3 else default_storage



