# Dockerfile for Django App and RQ Worker in a Single Container
FROM python:3.9.20-bullseye

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

WORKDIR /app
RUN mkdir -p /app/logs


# Copy requirements separately for better build caching
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Install supervisor to manage multiple processes
RUN apt-get update && apt-get install -y supervisor

# Copy the entire project
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Run migrations
RUN python manage.py migrate

# Copy Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE ${PORT}

# Run Supervisor
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
