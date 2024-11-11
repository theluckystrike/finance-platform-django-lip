# core

variable "region" {
  description = "The AWS region to create resources in."
  default     = "eu-west-2"
}


# networking

variable "public_subnet_1_cidr" {
  description = "CIDR Block for Public Subnet 1"
  default     = "10.0.1.0/24"
}
variable "public_subnet_2_cidr" {
  description = "CIDR Block for Public Subnet 2"
  default     = "10.0.2.0/24"
}
variable "private_subnet_1_cidr" {
  description = "CIDR Block for Private Subnet 1"
  default     = "10.0.3.0/24"
}
variable "private_subnet_2_cidr" {
  description = "CIDR Block for Private Subnet 2"
  default     = "10.0.4.0/24"
}
variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["eu-west-2b", "eu-west-2c"]
}

# ecs

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  default     = "oi-test-prod"
}

variable "docker_image_url_django" {
  description = "Docker image to run in the ECS cluster"
  default     = "022152200878.dkr.ecr.eu-west-2.amazonaws.com/oi-test:latest"
}

variable "app_count" {
  description = "Number of Docker containers to run"
  default     = 1
}

variable "fargate_cpu" {
  description = "Amount of CPU for Fargate task. E.g., '256' (.25 vCPU)"
  default     = "1024"
}

variable "fargate_memory" {
  description = "Amount of memory for Fargate task. E.g., '512' (0.5GB)"
  default     = "3072"
}

# rds

variable "rds_db_name" {
  description = "RDS database name"
  default     = "oitestdb"
}
variable "rds_username" {
  description = "RDS database username"
  default     = "testUser"
}
variable "rds_password" {
  description = "RDS database password"
}
variable "rds_instance_class" {
  description = "RDS instance type"
  default     = "db.t3.micro"
}

# load balancer

variable "health_check_path" {
  description = "Health check path for the default target group"
  default     = "/ping/"
}

# logs

variable "log_retention_days" {
  description = "Log retention days for logging service"
  default     = 5
}

