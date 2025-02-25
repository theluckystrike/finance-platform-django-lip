[
  {
    "name": "batch-update-scripts",
    "image": "${docker_image_url_django}",
    "essential": true,
    "command": ["python", "manage.py", "batchrunscripts", "-b", "12"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-prod-batch-update-scripts"
      }
    }
  }
]