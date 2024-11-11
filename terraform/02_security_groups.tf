resource "aws_security_group" "ecs-security-group" {
  vpc_id = aws_vpc.oi-test-vpc.id
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
  tags = {
    Name = "ECS_Security_Group"
  }
}

resource "aws_security_group" "rds_sg" {
  vpc_id      = aws_vpc.oi-test-vpc.id
  name        = "OITestRDSSecurityGroup"
  description = "Allow PostgreSQL traffic"
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    # cidr_blocks = [aws_sec]
    security_groups = [aws_security_group.ecs-security-group.id]
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