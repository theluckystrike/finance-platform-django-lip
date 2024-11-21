# Deployment / CICD

Almost all of the AWS resources required to deploy the backend are provisioned using Terraform. A Terraform workspace containing all of the required environment variables for the Docker containers must be created first as well as an ECR to host the backend Docker image. The domain `olandinvestments.com` is currently on GoDaddy but its nameservers have been changed to those provided by the provisioned Route 53 zone (these are available in the Terraform outputs).

## Resources

### [Setup](00_setup.tf)

Terraform backend definition and AWS region specification.

### [Terraform variables](variables.tf)

Variables required for Terraform to run. Those without defaults must be specified in the Terraform cloud workspace. The ECR image tag can be specified when running Terraform commands from the CLI.

### [VPC, Subnets and Internet Gateway](01_network.tf)

A VPC along with two private and two public subnets. Everything shares an Elastic IP.

### [Security Groups](02_security_groups.tf)

Security groups for restricting internet access to certain resources.

### [IAM Roles](03_iam.tf)

IAM roles for the ECS cluster and scheduled tasks.

### [ECR](04_ecr.tf)

A lifecycle policy for the ECR which must be created prior.

### [ECR](05_ecs.tf)

An ECS cluster as well as definitions for each task required by the Django app. One task defines the app itself (server and redis worker containers) while the other are management commands and database tasks for periodic execution.

### [RDS](06_rds.tf)

PostgresSQL database for the Django app to use.

### [Logging](07_logs.tf)

A log group for all resources to use.

### [Load Balancer](08_load_balancer.tf)

A load balancer to distribute requests across the VPC to the ECS cluster.

### [S3](09_s3.tf)

Public and private S3 buckets.

### [Cloudwatch Event](10_cloudwatch_events.tf)

Cloudwatch rules for running scheduled tasks. The tasks are some of those defined in `05_ecs.tf`.

### [Route 53 and SSL Certificates](11_route53.tf)

Route 53 zone and SSL certificate for HTTPS traffic. Alias records to route domain traffic to the loadbalancer.
