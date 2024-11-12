[
  {
    "name": "oi-test-app-container",
    "image": "${docker_image_url_django}",
    "essential": true,
    "cpu": 512,
    "memory": 1024,
    "portMappings": [
      {
        "containerPort": 8000,
        "protocol": "tcp"
      }
    ],
    "command": ["python", "manage.py", "runserver", "0.0.0.0:8000"],
    "environment": [
      {
        "name": "AWS_ACCESS_KEY_ID",
        "value": "${aws_access_key_id}"
      },
      {
        "name": "AWS_SECRET_ACCESS_KEY",
        "value": "${aws_secret_access_key}"
      },
      {
        "name": "AWS_STATIC_STORAGE_BUCKET_NAME",
        "value": "${public_bucket_name}"
      },
      {
        "name": "AWS_MEDIA_STORAGE_BUCKET_NAME",
        "value": "${public_bucket_name}"
      },
      {
        "name": "AWS_PRIVATE_STORAGE_BUCKET_NAME",
        "value": "${private_bucket_name}"
      },
      {
        "name": "DEBUG_VALUE",
        "value": "False"
      },
      {
        "name": "SECRET_KEY",
        "value": "${secret_key}"
      },
      {
        "name": "USE_S3",
        "value": "True"
      },
      {
        "name": "RDS_DB_NAME",
        "value": "${rds_db_name}"
      },
      {
        "name": "RDS_USERNAME",
        "value": "${rds_username}"
      },
      {
        "name": "RDS_PASSWORD",
        "value": "${rds_password}"
      },
      {
        "name": "RDS_HOSTNAME",
        "value": "${rds_hostname}"
      },
      {
        "name": "RDS_PORT",
        "value": "5432"
      },
      {
        "name": "REDISCLOUD_URL",
        "value": "${rediscloud_url}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/oi-test",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-app-log-stream"
      }
    }
  },
  {
    "name": "oi-test-rqworker-container",
    "image": "${docker_image_url_django}",
    "essential": true,
    "cpu": 512,
    "memory": 2048,
    "command": ["python", "manage.py", "rqworker", "scripts", "reports", "summaries"],
    "environment": [
      {
        "name": "AWS_ACCESS_KEY_ID",
        "value": "${aws_access_key_id}"
      },
      {
        "name": "AWS_SECRET_ACCESS_KEY",
        "value": "${aws_secret_access_key}"
      },
      {
        "name": "AWS_STATIC_STORAGE_BUCKET_NAME",
        "value": "${public_bucket_name}"
      },
      {
        "name": "AWS_MEDIA_STORAGE_BUCKET_NAME",
        "value": "${public_bucket_name}"
      },
      {
        "name": "AWS_PRIVATE_STORAGE_BUCKET_NAME",
        "value": "${private_bucket_name}"
      },
      {
        "name": "DEBUG_VALUE",
        "value": "False"
      },
      {
        "name": "SECRET_KEY",
        "value": "${secret_key}"
      },
      {
        "name": "USE_S3",
        "value": "True"
      },
      {
        "name": "RDS_DB_NAME",
        "value": "${rds_db_name}"
      },
      {
        "name": "RDS_USERNAME",
        "value": "${rds_username}"
      },
      {
        "name": "RDS_PASSWORD",
        "value": "${rds_password}"
      },
      {
        "name": "RDS_HOSTNAME",
        "value": "${rds_hostname}"
      },
      {
        "name": "RDS_PORT",
        "value": "5432"
      },
      {
        "name": "REDISCLOUD_URL",
        "value": "${rediscloud_url}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/oi-test",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-rqworker-log-stream"
      }
    }
  }
]