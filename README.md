# Source code for finance webapp prototype

Access the app [here](https://finance-platform-prototype-4ce168540ea9.herokuapp.com/).

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
