[
  {
    "name": "oi-test-scripts-update-container",
    "image": "${docker_image_url_django}:${docker_image_tag}",
    "essential": true,
    "command": ["python", "manage.py", "runallscripts"],
    "environment": ${common_env_vars},
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group_prefix}",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "oi-test-scripts-update-log-stream"
      }
    }
  }
]