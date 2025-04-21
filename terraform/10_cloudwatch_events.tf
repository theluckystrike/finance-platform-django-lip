resource "aws_cloudwatch_event_rule" "daily_script_update" {
  name = "DailyScriptUpdate"
  #   10am UTC every day
  schedule_expression = "cron(0 10 * * ? *)"
  is_enabled          = false
}


resource "aws_cloudwatch_event_target" "scripts_update_event_target" {
  rule     = aws_cloudwatch_event_rule.daily_script_update.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs_events_role.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_definition_arn = aws_ecs_task_definition.update_scripts.arn
    network_configuration {
      subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
      security_groups  = [aws_security_group.ecs_security_group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}

resource "aws_cloudwatch_event_rule" "batch_script_update" {
  name = "BatchScriptUpdate"
  #   Every hour on the hour
  schedule_expression = "cron(0 * * * ? *)"
}

resource "aws_cloudwatch_event_target" "batch_scripts_update_event_target" {
  rule     = aws_cloudwatch_event_rule.batch_script_update.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs_events_role.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_definition_arn = aws_ecs_task_definition.batch_update_scripts.arn
    network_configuration {
      subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
      security_groups  = [aws_security_group.ecs_security_group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}



resource "aws_cloudwatch_event_rule" "daily_data_scrape" {
  name = "DailyDataScrape"
  #   6am UTC every day
  schedule_expression = "cron(0 6 * * ? *)"
}

resource "aws_cloudwatch_event_target" "data_scrape_event_target" {
  rule     = aws_cloudwatch_event_rule.daily_data_scrape.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs_events_role.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_definition_arn = aws_ecs_task_definition.scrape.arn
    network_configuration {
      subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
      security_groups  = [aws_security_group.ecs_security_group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}
resource "aws_cloudwatch_event_rule" "daily_yf_data_collection" {
  name = "DailyYfDataCollection"
  #   6am UTC every day
  schedule_expression = "cron(0 6 * * ? *)"
}

resource "aws_cloudwatch_event_target" "yf_data_collection_event_target" {
  rule     = aws_cloudwatch_event_rule.daily_yf_data_collection.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs_events_role.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_definition_arn = aws_ecs_task_definition.yf_data_collection.arn
    network_configuration {
      subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
      security_groups  = [aws_security_group.ecs_security_group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}
resource "aws_cloudwatch_event_rule" "send_emails" {
  name = "DailyReports"
  #   8am UTC every day
  schedule_expression = "cron(0 8 * * ? *)"
}

resource "aws_cloudwatch_event_target" "send_emails_event_target" {
  rule     = aws_cloudwatch_event_rule.send_emails.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs_events_role.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_definition_arn = aws_ecs_task_definition.send_emails.arn
    network_configuration {
      subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
      security_groups  = [aws_security_group.ecs_security_group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}
resource "aws_cloudwatch_event_rule" "daily_reports_update" {
  name = "DailyReportsUpdate"
  #   7am UTC every day
  schedule_expression = "cron(0 7 * * ? *)"
}

resource "aws_cloudwatch_event_target" "update_reports_event_target" {
  rule     = aws_cloudwatch_event_rule.daily_reports_update.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs_events_role.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_definition_arn = aws_ecs_task_definition.update_reports.arn
    network_configuration {
      subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
      security_groups  = [aws_security_group.ecs_security_group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}


resource "aws_cloudwatch_event_rule" "daily_summaries_update" {
  name = "DailySummariesUpdate"
  #   7am UTC every day
  schedule_expression = "cron(0 6 * * ? *)"
}

resource "aws_cloudwatch_event_target" "update_summaries_event_target" {
  rule     = aws_cloudwatch_event_rule.daily_summaries_update.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs_events_role.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_definition_arn = aws_ecs_task_definition.update_summaries.arn
    network_configuration {
      subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
      security_groups  = [aws_security_group.ecs_security_group.id]
      assign_public_ip = true
    }
    platform_version = "LATEST"
  }
}
