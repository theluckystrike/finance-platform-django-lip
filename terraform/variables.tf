# core

variable "region" {
  description = "The AWS region to create resources in."
  default     = "ca-central-1"
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
  default     = ["ca-central-1b", "ca-central-1d"]
}


# ecr

# variable "ecr_repo_name" {
#   description = "ECR repository name"
#   default     = "oi-prod-repo"
# }
variable "ecr_repo_uri" {
  description = "ECR repository URI"
  default     = "024848465823.dkr.ecr.ca-central-1.amazonaws.com/oi-prod-repo"
}


# ecs

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  default     = "oi-prod-cluster"
}

variable "docker_image_tag" {
  description = "Docker image tag to run in the ECS cluster"
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
  default     = "oiproddb"
}
variable "rds_username" {
  description = "RDS database username"
  default     = "defaultUser"
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


# aws

variable "aws_access_key_id" {
  description = "AWS access key ID"
}

variable "aws_secret_access_key" {
  description = "AWS secret access key"
}


# Redis

variable "rediscloud_url" {
  description = "Redis Cloud Database URL"
}


# Django

variable "secret_key" {
  description = "Django secret key"
}


# S3

variable "private_bucket_name" {
  description = "AWS S3 private bucket name"
  default     = "oi-prod-private-storage"
}

variable "public_bucket_name" {
  description = "AWS S3 public bucket name"
  default     = "oi-prod-public-storage"
}



# acm + route53

variable "root_domain" {
  description = "Root domain for the site to be hosted on (Currently GoDaddy domain)"
  default     = "olandinvestments.com"
}

