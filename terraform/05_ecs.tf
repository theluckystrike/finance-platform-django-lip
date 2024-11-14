locals {
  container_vars = {
    docker_image_url_django = var.docker_image_url_django
    docker_image_tag        = var.docker_image_tag
    region                  = var.region
    log_group_prefix        = aws_cloudwatch_log_group.oi-test-log-group.name
    common_env_vars = jsonencode([
      { name = "AWS_ACCESS_KEY_ID", value = var.aws_access_key_id },
      { name = "AWS_SECRET_ACCESS_KEY", value = var.aws_secret_access_key },
      { name = "AWS_PUBLIC_STORAGE_BUCKET_NAME", value = var.public_bucket_name },
      { name = "AWS_PRIVATE_STORAGE_BUCKET_NAME", value = var.private_bucket_name },
      { name = "AWS_REGION_NAME", value = var.region },
      { name = "DEBUG_VALUE", value = "False" },
      { name = "SECRET_KEY", value = var.secret_key },
      { name = "USE_S3", value = "True" },
      { name = "RDS_DB_NAME", value = var.rds_db_name },
      { name = "RDS_USERNAME", value = var.rds_username },
      { name = "RDS_PASSWORD", value = var.rds_password },
      { name = "RDS_HOSTNAME", value = aws_db_instance.production.address },
      { name = "RDS_PORT", value = "5432" },
      { name = "REDISCLOUD_URL", value = var.rediscloud_url }
    ])
  }
}


resource "aws_ecs_cluster" "production" {
  name = "${var.ecs_cluster_name}-cluster"
}

data "template_file" "app" {
  template = file("templates/oi_test.json.tpl")

  vars = local.container_vars
}

resource "aws_ecs_task_definition" "app" {
  family                   = "oi-test-app-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  execution_role_arn       = aws_iam_role.ecs-task-execution-role.arn
  task_role_arn            = aws_iam_role.ecs-task-execution-role.arn
  container_definitions    = data.template_file.app.rendered
  depends_on               = [aws_db_instance.production, aws_cloudwatch_log_group.oi-test-log-group]
}

data "template_file" "migrate" {
  template = file("templates/oi_test_migrate.json.tpl")

  vars = local.container_vars
}
resource "aws_ecs_task_definition" "oi-test-migrate" {
  family                   = "oi-test-migration-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs-task-execution-role.arn
  task_role_arn            = aws_iam_role.ecs-task-execution-role.arn
  container_definitions    = data.template_file.migrate.rendered
  depends_on               = [aws_db_instance.production, aws_cloudwatch_log_group.oi-test-log-group]
}

data "template_file" "scrape" {
  template = file("templates/data_collection_task.json.tpl")

  vars = local.container_vars
}
resource "aws_ecs_task_definition" "oi-test-scraping" {
  family                   = "oi-test-scraping-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs-task-execution-role.arn
  task_role_arn            = aws_iam_role.ecs-task-execution-role.arn
  container_definitions    = data.template_file.scrape.rendered
  depends_on               = [aws_db_instance.production, aws_cloudwatch_log_group.oi-test-log-group]
}
data "template_file" "scripts-update" {
  template = file("templates/update_scripts_task.json.tpl")

  vars = local.container_vars
}
resource "aws_ecs_task_definition" "oi-test-scripts-update" {
  family                   = "oi-test-scripts-update-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs-task-execution-role.arn
  task_role_arn            = aws_iam_role.ecs-task-execution-role.arn
  container_definitions    = data.template_file.scripts-update.rendered
  depends_on               = [aws_db_instance.production, aws_cloudwatch_log_group.oi-test-log-group]
}


resource "aws_ecs_service" "production" {
  name            = "${var.ecs_cluster_name}-service"
  cluster         = aws_ecs_cluster.production.id
  task_definition = aws_ecs_task_definition.app.arn
  # iam_role = 
  launch_type   = "FARGATE"
  desired_count = var.app_count
  network_configuration {
    subnets          = [aws_subnet.public-subnet-1.id, aws_subnet.private-subnet-2.id]
    security_groups  = [aws_security_group.ecs-security-group.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.default-target-group.arn
    container_name   = "oi-test-app-container"
    container_port   = 8000
  }
}
