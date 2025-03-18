[
  {
    "name": "rates",
    "image": "${docker_image_url_django}",
    "essential": false,
    "command": ["python", "manage.py", "getmostrecentrates"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-prod-date-scrape"
      }
    }
  },
  {
    "name": "ohlc",
    "image": "${docker_image_url_django}",
    "essential": true,
    "command": ["python", "manage.py", "getmostrecentohlcdata"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-prod-date-scrape"
      }
    }
  },
  {
    "name": "indexes",
    "image": "${docker_image_url_django}",
    "essential": false,
    "command": ["python", "manage.py", "getmostrecentindexdata"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-prod-date-scrape"
      }
    }
  },
  {
    "name": "exchanges",
    "image": "${docker_image_url_django}",
    "essential": false,
    "command": ["python", "manage.py", "updateexchangedata"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-prod-date-scrape"
      }
    }
  },
  {
    "name": "blackrock",
    "image": "${docker_image_url_django}",
    "essential": false,
    "command": ["python", "manage.py", "updateblackrockindexdata"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-prod-data-scrape"
      }
    }
  }
]