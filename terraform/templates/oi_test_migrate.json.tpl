[
  {
    "name": "oi-test-migration-container",
    "image": "${docker_image_url_django}",
    "essential": true,
    "cpu": 100,
    "memory": 512,
    "portMappings": [
      {
        "containerPort": 8000,
        "protocol": "tcp"
      }
    ],
    "command": ["python", "manage.py", "migrate"],
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
        "name": "AWS_STORAGE_BUCKET_NAME",
        "value": "${aws_bucket_name}"
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
        "awslogs-stream-prefix": "oi-test-migrate-log-stream"
      }
    }
  }
]