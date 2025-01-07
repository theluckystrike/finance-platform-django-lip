locals {
  container_vars = {
    docker_image_url_django = "${var.ecr_repo_uri}:${var.docker_image_tag}"
    region                  = var.region
    log_group_prefix        = aws_cloudwatch_log_group.oi_prod_log_group.name
    common_env_vars = jsonencode([
      { name = "AWS_ACCESS_KEY_ID", value = var.aws_access_key_id },
      { name = "AWS_SECRET_ACCESS_KEY", value = var.aws_secret_access_key },
      { name = "AWS_PUBLIC_STORAGE_BUCKET_NAME", value = var.public_bucket_name },
      { name = "AWS_PRIVATE_STORAGE_BUCKET_NAME", value = var.private_bucket_name },
      { name = "AWS_REGION_NAME", value = var.region },
      { name = "SECRET_KEY", value = var.secret_key },
      { name = "USE_S3", value = "True" },
      { name = "RDS_DB_NAME", value = var.rds_db_name },
      { name = "RDS_USERNAME", value = var.rds_username },
      { name = "RDS_PASSWORD", value = var.rds_password },
      { name = "RDS_HOSTNAME", value = aws_db_instance.production.address },
      { name = "RDS_PORT", value = "5432" },
      { name = "REDISCLOUD_URL", value = var.rediscloud_url },
      { name = "FP_HEROKU_API_KEY", value = var.fp_heroku_api_key },
      { name = "FRED_API_KEY", value = var.fred_api_key },
      { name = "MPLBACKEND", value = "Agg" },
      { name = "AWS_SMTP_USER", value = var.email_user },
      { name = "AWS_SMTP_PASSWORD", value = var.email_password },
      { name = "AWS_EMAIL_HOST", value = var.email_host },
      { name = "DEFAULT_FROM_EMAIL", value = var.email_default_from_address },
      { name = "OI_API_URL", value = "https://api.${var.root_domain}/" }
    ])
  }
}


resource "aws_ecs_cluster" "production" {
  name = var.ecs_cluster_name
}

resource "aws_ecs_cluster_capacity_providers" "production" {
  cluster_name = aws_ecs_cluster.production.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 100
  }
}

data "template_file" "app" {
  template = file("templates/app_task.json.tpl")

  vars = local.container_vars
}

resource "aws_ecs_task_definition" "app" {
  family                   = "oi-prod-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = data.template_file.app.rendered
  depends_on               = [aws_db_instance.production, aws_cloudwatch_log_group.oi_prod_log_group]
}

data "template_file" "migrate" {
  template = file("templates/migrate_task.json.tpl")

  vars = local.container_vars
}
resource "aws_ecs_task_definition" "migrate" {
  family                   = "oi-prod-db-migration"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = data.template_file.migrate.rendered
  depends_on               = [aws_db_instance.production, aws_cloudwatch_log_group.oi_prod_log_group]
}

data "template_file" "scrape" {
  template = file("templates/data_collection_task.json.tpl")

  vars = local.container_vars
}
resource "aws_ecs_task_definition" "scrape" {
  family                   = "oi-prod-data-scraping"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = data.template_file.scrape.rendered
  depends_on               = [aws_db_instance.production, aws_cloudwatch_log_group.oi_prod_log_group]
}
data "template_file" "update_scripts" {
  template = file("templates/update_scripts_task.json.tpl")

  vars = local.container_vars
}
resource "aws_ecs_task_definition" "update_scripts" {
  family                   = "oi-prod-update-scripts"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = data.template_file.update_scripts.rendered
  depends_on               = [aws_db_instance.production, aws_cloudwatch_log_group.oi_prod_log_group]
}
data "template_file" "send_email" {
  template = file("templates/send_emails_task.json.tpl")

  vars = local.container_vars
}
resource "aws_ecs_task_definition" "send_emails" {
  family                   = "oi-prod-send-emails"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = data.template_file.send_email.rendered
  depends_on               = [aws_db_instance.production, aws_cloudwatch_log_group.oi_prod_log_group]
}


resource "aws_ecs_service" "production" {
  name            = "${var.ecs_cluster_name}-service"
  cluster         = aws_ecs_cluster.production.id
  task_definition = aws_ecs_task_definition.app.arn
  # iam_role = 
  # launch_type   = "FARGATE"
  desired_count = var.app_count
  network_configuration {
    subnets          = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
    security_groups  = [aws_security_group.ecs_security_group.id]
    assign_public_ip = true
  }
  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight = 100
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.default_target_group.arn
    container_name   = "web"
    container_port   = 8000
  }
}
