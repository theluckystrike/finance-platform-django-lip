[
  {
    "name": "oi-test-app-container",
    "image": "${docker_image_url_django}",
    "essential": true,
    "portMappings": [
      {
        "containerPort": 8000,
        "protocol": "tcp"
      }
    ],
    "command": ["python", "manage.py", "runserver", "0.0.0.0:8000"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-app-log-stream"
      }
    }
  },
  {
    "name": "oi-test-rqworker-container",
    "image": "${docker_image_url_django}",
    "essential": true,
    "command": ["python", "manage.py", "rqworker", "scripts", "reports", "summaries"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-rqworker-log-stream"
      }
    }
  }
]