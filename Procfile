release: bash setup.sh
release: python manage.py migrate
web: gunicorn financeplatform.wsgi
worker: python manage.py rqworker scripts reports