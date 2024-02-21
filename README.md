# Source code for finance webapp prototype

Access the app [here](https://finance-platform-prototype-4ce168540ea9.herokuapp.com/).

## Stack
This backend uses the following:
- AWS S3 through [boto3](https://github.com/boto/boto3)
- [django-tables2](https://github.com/jieter/django-tables2)
- [Redis Queue](https://github.com/rq/rq) for background tasks via [django-rq](https://github.com/rq/django-rq)
- [Django REST framework](https://github.com/encode/django-rest-framework)
- [ReportLab](https://docs.reportlab.com/reportlab/userguide/ch1_intro/) for making PDFs

And the frontend uses the following:
- [Bootstrap5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [jQuery](https://jquery.com)
- [Feather](https://feathericons.com)
- [HTMX](https://htmx.org)
- [Django Templates](https://docs.djangoproject.com/en/4.2/topics/templates/)

## Setup

You will need a .env file in the base directory that has environment variables for the AWS S3 bucket details for static and media storage. This file should look like this:

```
AWS_ACCESS_KEY_ID = ""
AWS_SECRET_ACCESS_KEY = ""
AWS_STORAGE_BUCKET_NAME = ""
USE_S3 = True (production) | False (development)
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_PORT = ""
EMAIL_HOST = ""
```

## Run the app locally

To run the app in the local development environment run the following command:

```
python manage.py runserver
```

To run the task queue (RQ) you must have a Redis server running locally. You can install redis using:
```
brew install redis
```
And run the server using:
```
redis-server
```
The task queue can then be started using:
```
python manage.py rqworker scripts reports
```