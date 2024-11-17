# ALB Security Group (Traffic Internet -> ALB)
resource "aws_security_group" "load_balancer" {
  name        = "load_balancer_security_group"
  # name        = "OIProdVPCSecurityGroup"
  description = "Controls access to the ALB"
  vpc_id      = aws_vpc.oi_prod_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_security_group" "ecs_security_group" {
  vpc_id = aws_vpc.oi_prod_vpc.id
  name   = "OIProdECSSecurityGroup"
  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.load_balancer.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "ECS_Security_Group"
  }
}

resource "aws_security_group" "rds_security_group" {
  vpc_id      = aws_vpc.oi_prod_vpc.id
  name        = "OIProdRDSSecurityGroup"
  description = "Allow PostgreSQL traffic"
  ingress {
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"
    # cidr_blocks = [aws_sec]
    security_groups = [aws_security_group.ecs_security_group.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "RDS_Security_Group"
  }
}
