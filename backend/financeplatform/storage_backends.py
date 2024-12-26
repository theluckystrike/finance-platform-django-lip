"""
Configuration for setting up Django's connection with AWS S3. The classes each describe a type of storage
(eg. static, public, or private), and set rules for how they should behave when new files are uploaded.

These rules are referenced in the settings.py file (see STATICFILES_STORAGE = 'financeplatform.storage_backends.StaticStorage')
Which then allows them to be passed into the project configuration.

For more information, see
https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html
"""

from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings


class StaticStorage(S3Boto3Storage):
    location = 'static'
    default_acl = 'public-read'
    querystring_auth = False
    bucket_name = settings.AWS_STATIC_STORAGE_BUCKET_NAME


class PublicMediaStorage(S3Boto3Storage):
    location = 'media'
    default_acl = 'public-read'
    file_overwrite = False
    querystring_auth = False
    bucket_name = settings.AWS_MEDIA_STORAGE_BUCKET_NAME


class PrivateMediaStorage(S3Boto3Storage):
    location = 'private'
    default_acl = 'private'
    file_overwrite = True
    custom_domain = False
    bucket_name = settings.AWS_PRIVATE_STORAGE_BUCKET_NAME
    querystring_auth = True
