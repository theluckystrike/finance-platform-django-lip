release: python backend/manage.py migrate
web: gunicorn backend.financeplatform.wsgi
worker: python backend/manage.py rqworker scripts reports