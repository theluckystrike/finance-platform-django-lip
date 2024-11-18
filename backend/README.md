# Oland Investments Platform Backend

Access the app [here](https://olandinvestments.com/).

## Stack

This backend uses the following:

- AWS S3 through [boto3](https://github.com/boto/boto3)
- [django-tables2](https://github.com/jieter/django-tables2)
- [Redis Queue](https://github.com/rq/rq) for background tasks via [django-rq](https://github.com/rq/django-rq)
- [Django REST framework](https://github.com/encode/django-rest-framework)
- [ReportLab](https://docs.reportlab.com/reportlab/userguide/ch1_intro/) for making PDFs
- [drf-yasg](https://github.com/axnsan12/drf-yasg) for creating API documentation

And the frontend templates uses the following:

- [Bootstrap5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [jQuery](https://jquery.com)
- [Feather](https://feathericons.com)
- [HTMX](https://htmx.org)
- [Django Templates](https://docs.djangoproject.com/en/4.2/topics/templates/)
- [Plotly](https://github.com/plotly/plotly.py) and [matplotlib](https://github.com/matplotlib/matplotlib) for visualisation

## Setup

You will need a `.env` file in this directory for the app to use. It should look something like this:

```env
USE_S3 = False
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_PORT = ""
EMAIL_HOST = ""
MPLBACKEND="Agg"
SECRET_KEY="abc123"
```

## Run the app locally

To run the app in the local development environment run the following command you need to have all of the Python [requirements](requirements.txt) installed, preferably in a virtual environment. You can then run:

```bash
python manage.py runserver
```

To run the task queue (RQ) you must have a Redis server running locally. You can run the Redis worker with:

```bash
python manage.py rqworker scripts reports summaries
```

## Docker

During deployment to production, the app is build into a Docker image. You can test this image by first building it:

```bash
docker build -t local-image:test .
```

and then running it:

```bash
docker run -p 8000:8000 --name backend-test local-image:test python manage.py runserver
```

This will only run the server, not the Redis worker, but is useful for making sure everything build and runs as expected.

## API Documentation

The backend API has documentation automatically created by [drf-yasg](https://github.com/axnsan12/drf-yasg) in a [swagger-ui](https://github.com/swagger-api/swagger-ui). It is accessible at [/api-documentation/](https://finance-platform-prototype-4ce168540ea9.herokuapp.com/api-documentation/). Make sure to run the server so that you can access it (no need to run the redis worker for this).
