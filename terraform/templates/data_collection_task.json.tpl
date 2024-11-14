[
  {
    "name": "oi-test-rates-container",
    "image": "${docker_image_url_django}",
    "essential": false,
    "command": ["python", "manage.py", "getmostrecentrates"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-rates-log-stream"
      }
    }
  },
  {
    "name": "oi-test-ohlc-container",
    "image": "${docker_image_url_django}",
    "essential": true,
    "command": ["python", "manage.py", "getmostrecentohlcdata"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-ohlc-log-stream"
      }
    }
  },
  {
    "name": "oi-test-index-container",
    "image": "${docker_image_url_django}",
    "essential": false,
    "command": ["python", "manage.py", "getmostrecentindexdata"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-index-log-stream"
      }
    }
  },
  {
    "name": "oi-test-exchanges-container",
    "image": "${docker_image_url_django}",
    "essential": false,
    "command": ["python", "manage.py", "updateexchangedata"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-exchanges-log-stream"
      }
    }
  },
  {
    "name": "oi-test-blackrock-container",
    "image": "${docker_image_url_django}",
    "essential": false,
    "command": ["python", "manage.py", "updateblackrockindexdata"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-blackrock-log-stream"
      }
    }
  }
]