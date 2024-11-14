resource "aws_cloudwatch_log_group" "oi_prod_log_group" {
  name              = "/ecs/oi-prod"
  retention_in_days = var.log_retention_days
}
