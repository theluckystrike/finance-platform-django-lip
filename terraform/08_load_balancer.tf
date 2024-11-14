# Production Load Balancer
resource "aws_lb" "production" {
  name               = "${var.ecs_cluster_name}-alb"
  load_balancer_type = "application"
  internal           = false
  security_groups    = [aws_security_group.load_balancer.id]
  subnets            = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_1.id]
}

# Target group for ECS Fargate
resource "aws_alb_target_group" "default_target_group" {
  name        = "${var.ecs_cluster_name}-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.oi_prod_vpc.id
  target_type = "ip"

  health_check {
    path                = var.health_check_path
    port                = "traffic-port"
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }
}

# Listener (redirects traffic from the load balancer to the target group)
resource "aws_alb_listener" "ecs_alb_http_listener" {
  load_balancer_arn = aws_lb.production.id
  port              = "80"
  protocol          = "HTTP"
  depends_on        = [aws_alb_target_group.default_target_group]

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.default_target_group.arn
  }
}
