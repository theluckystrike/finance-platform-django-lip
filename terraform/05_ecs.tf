resource "aws_ecs_cluster" "production" {
  name = "${var.ecs_cluster_name}-cluster"
}

data "template_file" "app" {
  template = file("templates/oi_test.json.tpl")

  vars = {
    docker_image_url_django = var.docker_image_url_django
    region                  = var.region
    rds_db_name             = var.rds_db_name
    rds_username            = var.rds_username
    rds_password            = var.rds_password
    rds_hostname            = aws_db_instance.production.address
    aws_bucket_name         = var.aws_bucket_name
    aws_access_key_id       = var.aws_access_key_id
    aws_secret_access_key   = var.aws_secret_access_key
    rediscloud_url          = var.rediscloud_url
    secret_key              = var.secret_key
    public_bucket_name      = var.public_bucket_name
    private_bucket_name     = var.private_bucket_name
  }
}
data "template_file" "migrate" {
  template = file("templates/oi_test_migrate.json.tpl")

  vars = {
    docker_image_url_django = var.docker_image_url_django
    region                  = var.region
    rds_db_name             = var.rds_db_name
    rds_username            = var.rds_username
    rds_password            = var.rds_password
    rds_hostname            = aws_db_instance.production.address
    aws_bucket_name         = var.aws_bucket_name
    aws_access_key_id       = var.aws_access_key_id
    aws_secret_access_key   = var.aws_secret_access_key
    rediscloud_url          = var.rediscloud_url
    secret_key              = var.secret_key
    public_bucket_name      = var.public_bucket_name
    private_bucket_name     = var.private_bucket_name
  }
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
  depends_on               = [aws_db_instance.production]
}

resource "aws_ecs_task_definition" "oi-test-migrate" {
  family                   = "oi-test-migration-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  execution_role_arn       = aws_iam_role.ecs-task-execution-role.arn
  task_role_arn            = aws_iam_role.ecs-task-execution-role.arn
  container_definitions    = data.template_file.migrate.rendered
  depends_on               = [aws_db_instance.production]
}


resource "aws_ecs_service" "production" {
  name            = "${var.ecs_cluster_name}-service"
  cluster         = aws_ecs_cluster.production.id
  task_definition = aws_ecs_task_definition.app.arn
  launch_type     = "FARGATE"
  desired_count   = var.app_count
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
