resource "aws_cloudwatch_event_rule" "daily-script-update" {
  name = "DailyScriptUpdate"
  #   10am UTC every day
  schedule_expression = "cron(0 10 * * ? *)"
}

resource "aws_cloudwatch_event_target" "scripts-update-event-target" {
  rule     = aws_cloudwatch_event_rule.daily-script-update.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs-task-execution-role.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_definition_arn = aws_ecs_task_definition.oi-test-scripts-update.arn
    network_configuration {
      subnets          = [aws_subnet.public-subnet-1.id, aws_subnet.public-subnet-2.id]
      security_groups  = [aws_security_group.ecs-security-group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}
resource "aws_cloudwatch_event_rule" "daily-data-scrape" {
  name = "DailyDataScrape"
  #   10am UTC every day
  schedule_expression = "cron(0 6 * * ? *)"
}

resource "aws_cloudwatch_event_target" "data-scrape-event-target" {
  rule     = aws_cloudwatch_event_rule.daily-data-scrape.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs-task-execution-role.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_definition_arn = aws_ecs_task_definition.oi-test-scraping.arn
    network_configuration {
      subnets          = [aws_subnet.public-subnet-1.id, aws_subnet.public-subnet-2.id]
      security_groups  = [aws_security_group.ecs-security-group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}