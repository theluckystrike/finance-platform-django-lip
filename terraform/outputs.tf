output "ecs_task_execution_role_arn" {
  description = "ARN for the ECS Task Execution Role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "subnet1" {
  description = "Public subnet 1"
  value = aws_subnet.public_subnet_1.id
}
output "subnet2" {
  description = "Public subnet 2"
  value = aws_subnet.public_subnet_2.id
}

output "security_group" {
  description = "ECS security group ID"
  value = aws_security_group.ecs_security_group.id
}

output "alb_hostname" {
  description = "Load balancer URL"
  value = aws_lb.production.dns_name
}

output "route_53_nameservers" {
  description = "Route 53 Zone nameservers"
  value = aws_route53_zone.main.name_servers
}
