resource "aws_iam_role" "ecs-task-execution-role" {
  name               = "ecs_task_execution_role_prod"
  assume_role_policy = file("policies/ecs-role.json")
}

resource "aws_iam_role_policy" "ecs-task-execution-role-policy" {
  name   = "ecs_task_execution_role_policy"
  policy = file("policies/ecs-task-execution-policy.json")
  role   = aws_iam_role.ecs-task-execution-role.id
}

# resource "aws_iam_role" "ecs-service-role" {
#   name               = "ecs_service_role_prod"
#   assume_role_policy = file("policies/ecs-role.json")
# }

# resource "aws_iam_role_policy" "ecs-service-role-policy" {
#   name   = "ecs_service_role_policy"
#   policy = file("policies/ecs-service-role-policy.json")
#   role   = aws_iam_role.ecs-service-role.id
# }

resource "aws_iam_role" "s3-access-role" {
  name               = "s3_access_role"
  assume_role_policy = file("policies/s3-role.json")
}

data "template_file" "s3-role-policy" {
  template = file("templates/s3-role-policy.json.tpl")

  vars = {
    private_bucket_name = var.private_bucket_name
    public_bucket_name  = var.public_bucket_name
  }
}

resource "aws_iam_role_policy" "s3-access-policy" {
  name   = "s3_access_policy"
  role   = aws_iam_role.s3-access-role.id
  policy = data.template_file.s3-role-policy.rendered
}