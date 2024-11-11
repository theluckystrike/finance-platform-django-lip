resource "aws_cloudwatch_log_group" "oi-test-log-group" {
  name              = "/ecs/oi-test"
  retention_in_days = 5
}