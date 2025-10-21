Terraform Cloud Variables Setup


OVERVIEW

Set up the required Terraform variables in HCP Terraform Cloud for the oland-investments-prod workspace.

Workspace location
https://app.terraform.io/app/oland_investments/oland-investments-prod/variables


QUICK START

Navigate to the workspace variables page and add each variable listed below. Select "Terraform variable" type for all entries. Mark sensitive variables appropriately to protect credentials.


REQUIRED VARIABLES

Docker and ECS Configuration

docker_image_tag
Docker image tag for the ECS cluster deployment
Sensitive: No
Example: latest, v1.0.0, or commit SHA
Reference: 024848465823.dkr.ecr.ca-central-1.amazonaws.com/oi-prod-repo


Database Configuration

rds_password
PostgreSQL RDS instance password
Sensitive: Yes
Format: Strong password combining letters, numbers, and special characters
Note: Username defaults to defaultUser, database name defaults to oiproddb


AWS Credentials

aws_access_key_id
AWS access key for IAM authentication
Sensitive: Yes
Format: 20 alphanumeric characters starting with AKIA

aws_secret_access_key
AWS secret key paired with the access key above
Sensitive: Yes
Format: 40 base64 characters


Redis Configuration

rediscloud_url
Redis Cloud connection string for caching and sessions
Sensitive: Yes
Format: redis://default:password@host:port

Before setting the variable

Variable name: rediscloud_url
Variable value: [empty]

After setting the variable

Variable name: rediscloud_url
Variable value: redis://default:abc123xyz@redis-12345.c1.us-east-1.ec2.cloud.redislabs.com:12345
Sensitive: checked


Django Configuration

secret_key
Django cryptographic signing key
Sensitive: Yes
Format: Random string of 50+ characters

Generate a new secret key using Python

python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

Output example

django-insecure-k8#x9w&m2p@v$n7*e!h5q3r^t6y8u+i-o0p[a]s{d}f;g:h


API Keys

fp_heroku_api_key
Backend database access authentication key
Sensitive: Yes
Purpose: Custom API key for finance platform backend requests

fred_api_key
Federal Reserve Economic Data API key
Sensitive: Yes
Format: 32 alphanumeric characters
Register at https://fred.stlouisfed.org/docs/api/api_key.html


Email and SES Configuration

email_host
AWS SES SMTP endpoint for the deployment region
Sensitive: No
Value: email-smtp.ca-central-1.amazonaws.com

email_user
AWS SES SMTP username for outbound email
Sensitive: Yes
Format: 20 alphanumeric characters starting with AK
Note: Generate in AWS SES console, distinct from AWS access keys

email_password
AWS SES SMTP password paired with username above
Sensitive: Yes
Format: 44 base64 characters


SETUP PROCESS

Step 1: Access Variables
Navigate to the workspace and select Variables from the sidebar

Step 2: Add Variable
Click Add variable button
Select Terraform variable type
Enter exact variable name
Input the value
Check Sensitive for protected values
Save the variable

Step 3: Verify Configuration
Confirm all 11 variables are present
Check sensitive variables display as write-only
Validate variable names match exactly

Step 4: Test Deployment
Queue a new plan from Terraform Cloud
Review plan output for errors
Apply when ready


CONFIGURATION CHECKLIST

docker_image_tag
rds_password
aws_access_key_id
aws_secret_access_key
rediscloud_url
secret_key
fp_heroku_api_key
fred_api_key
email_host
email_user
email_password


VARIABLES WITH DEFAULTS

The following variables have preset defaults and require no action

region (ca-central-1)
ecs_cluster_name (oi-prod-cluster)
ecr_repo_uri (024848465823.dkr.ecr.ca-central-1.amazonaws.com/oi-prod-repo)
rds_db_name (oiproddb)
rds_username (defaultUser)
rds_instance_class (db.t3.micro)
fargate_cpu (1024)
fargate_memory (3072)
app_count (1)
private_bucket_name (oi-prod-private-storage)
public_bucket_name (oi-prod-public-storage)
root_domain (olandinvestments.com)
email_default_from_address (no-reply@olandinvestments.com)
health_check_path (/ping/)
log_retention_days (5)


TROUBLESHOOTING

Variable not set error persists
Verify selection of Terraform variable instead of Environment variable
Check variable name spelling and case sensitivity

Authentication failures in plan
Validate AWS credentials and permissions
Confirm Redis URL format and authentication details

Email or SES errors
Use SES SMTP credentials instead of standard AWS credentials
Generate SMTP credentials in AWS SES console under IAM Security Credentials

Docker image not found
Verify the tag exists in ECR repository
Confirm ECR URI matches expected value


EXAMPLE: ADDING AWS ACCESS KEY

Before configuration

Terraform Cloud shows error:
Error: No value for required variable
  on variables.tf line 107:
  107: variable "aws_access_key_id"

After configuration

Variable type: Terraform variable
Variable name: aws_access_key_id
Variable value: AKIAIOSFODNN7EXAMPLE
Sensitive: checked
Status: Saved


EXAMPLE: GENERATING DJANGO SECRET KEY

Command to generate

python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

Sample output

django-insecure-8h#m2@v9w&p$n7*k3r!e5q^t6y8u+i-o0p[a]s{d}f;g:x

Adding to Terraform Cloud

Variable type: Terraform variable
Variable name: secret_key
Variable value: django-insecure-8h#m2@v9w&p$n7*k3r!e5q^t6y8u+i-o0p[a]s{d}f;g:x
Sensitive: checked
Description: Django cryptographic signing key


SECURITY GUIDELINES

Mark all credentials and keys as sensitive
Use strong unique passwords for database and Django configuration
Rotate credentials every 90 days minimum
Never commit sensitive values to version control
Restrict workspace access to authorized personnel only
Apply least-privilege IAM permissions
Enable multi-factor authentication on AWS and Terraform Cloud accounts


RESOURCES

Terraform Cloud Workspace
https://app.terraform.io/app/oland_investments/oland-investments-prod

Variables Configuration
https://app.terraform.io/app/oland_investments/oland-investments-prod/variables

FRED API Registration
https://fred.stlouisfed.org/docs/api/api_key.html

AWS SES SMTP Credentials Guide
https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html

Redis Cloud Overview
https://redis.com/redis-enterprise-cloud/overview/


NEXT STEPS

After completing variable configuration, run terraform plan in HCP Terraform to verify the setup. Review the plan output carefully before applying changes. Monitor the deployment progress in Terraform Cloud and verify application functionality after deployment completes.


Document version 1.0
Updated October 21, 2025
Workspace oland-investments-prod
Organization oland_investments
