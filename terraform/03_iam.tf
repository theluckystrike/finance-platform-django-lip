resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs_task_execution_role_prod"
  assume_role_policy = file("policies/ecs-role.json")
}

resource "aws_iam_role_policy" "ecs_task_execution_role_policy" {
  name   = "ecs_task_execution_role_policy"
  policy = file("policies/ecs-task-execution-policy.json")
  role   = aws_iam_role.ecs_task_execution_role.id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_target

resource "aws_iam_role" "ecs_events_role" {
  name               = "ecs_events_execution_role_prod"
  assume_role_policy = file("policies/events-role.json")
}

resource "aws_iam_role_policy" "ecs_events_execution_role_policy" {
  name   = "ecs_events_execution_role_policy"
  policy = file("policies/ecs-events-execution-policy.json")
  role   = aws_iam_role.ecs_events_role.id
}
