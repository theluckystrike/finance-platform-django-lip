output "ecs_task_execution_role_arn" {
  value       = aws_iam_role.ecs_task_execution_role.arn
  description = "ARN for the ECS Task Execution Role"
}

output "subnet1" {
  value = aws_subnet.public_subnet_1.id
}
output "subnet2" {
  value = aws_subnet.public_subnet_2.id
}

output "security_group" {
  value = aws_security_group.ecs_security_group.id
}

output "alb_hostname" {
  value = aws_lb.production.dns_name
}
