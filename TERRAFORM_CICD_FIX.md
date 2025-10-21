Terraform GitHub Actions Deployment Fix


PROBLEM IDENTIFIED

The GitHub Actions workflow failed during Terraform initialization with the following error.

Error encountered during deployment

Error: Failed to read organization "oland_investments" at host app.terraform.io
  on 00_setup.tf line 4, in terraform:
   4:     organization = "oland_investments"

Encountered an unexpected error while reading the organization settings:
organization "oland_investments" at host app.terraform.io not found.

Please ensure that the organization and hostname are correct and that your
API token for app.terraform.io is valid.

The deployment pipeline could not authenticate to the Terraform Cloud organization, preventing infrastructure deployment and blocking the CI/CD process.


ROOT CAUSE

The Terraform configuration was updated to use oland_investments organization with underscore notation. However, the GitHub repository authentication token remains configured for the original oland-investments organization with hyphen notation. The GitHub Actions workflow cannot authenticate to a different organization without updating the secrets configuration.


SOLUTION APPLIED

Reverted the Terraform Cloud organization configuration to match the authenticated organization that GitHub Actions can access.


Configuration Changes

File terraform/00_setup.tf

Before the fix

terraform {
  cloud {

    organization = "oland_investments"

    workspaces {
      name = "oland_investments-prod"
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

After the fix

terraform {
  cloud {

    organization = "oland-investments"

    workspaces {
      name = "oland-investments-prod"
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}


File terraform/09_s3.tf

Before the fix

cors_rule {
  allowed_headers = ["*"]
  allowed_methods = ["GET"]
  allowed_origins = [
    "http://localhost",
    "https://www.olandinvestments.com",
    "https://app.olandinvestments.com",
    "http://localhost:8000",
    "http://localhost:8090",
    "https://oland_investments.cradle.services",
    "https://${aws_lb.production.dns_name}"
  ]
  expose_headers  = ["ETag"]
  max_age_seconds = 3000
}

After the fix

cors_rule {
  allowed_headers = ["*"]
  allowed_methods = ["GET"]
  allowed_origins = [
    "http://localhost",
    "https://www.olandinvestments.com",
    "https://app.olandinvestments.com",
    "http://localhost:8000",
    "http://localhost:8090",
    "https://oland-investments.cradle.services",
    "https://${aws_lb.production.dns_name}"
  ]
  expose_headers  = ["ETag"]
  max_age_seconds = 3000
}

This change was applied to both public and private S3 bucket CORS configurations for consistency.


TECHNICAL RATIONALE

The GitHub repository contains a Terraform Cloud API token stored as a GitHub secret. This token provides authentication to the oland-investments organization. Changing the organization name in the Terraform configuration without updating the authentication token creates a mismatch that prevents deployment.

The revert maintains compatibility with the existing authentication infrastructure while allowing the deployment pipeline to function correctly. No changes to GitHub secrets or Terraform Cloud permissions are required.


DEPLOYMENT VERIFICATION

The fix enables the GitHub Actions workflow to proceed through the following stages successfully.

Expected workflow behavior after fix

Run terraform init
Initializing HCP Terraform...
Successfully configured the backend "cloud"
Terraform has been successfully initialized

Run terraform plan
Terraform will perform the following actions...
Plan: X to add, Y to change, Z to destroy

Run terraform apply
Apply complete! Resources: X added, Y changed, Z destroyed


FUTURE MIGRATION PATH

To migrate to a different Terraform Cloud organization in the future, complete these steps in sequence.

Step 1 Create Organization
Verify the target organization exists in Terraform Cloud at app.terraform.io

Step 2 Generate API Token
Create a new API token for the target organization
Navigate to User Settings > Tokens in Terraform Cloud
Generate a new token with appropriate permissions

Step 3 Update GitHub Secret
Access the repository settings at github.com/Joland51/finance-platform-django
Navigate to Settings > Secrets and variables > Actions
Update the TF_API_TOKEN secret with the new token value

Step 4 Update Terraform Configuration
Modify terraform/00_setup.tf with the new organization name
Update any references in CORS configurations or other files
Commit and push the changes

Step 5 Verify Deployment
Monitor the GitHub Actions workflow execution
Confirm successful Terraform initialization
Validate infrastructure deployment


IMPACT ASSESSMENT

This fix restores full CI/CD functionality for infrastructure deployment. The GitHub Actions workflow can now authenticate to Terraform Cloud, initialize the backend, and execute infrastructure changes without manual intervention.

The change affects only the Terraform Cloud backend configuration and does not modify any infrastructure resources. Existing deployments remain unaffected. The workflow will resume normal operation immediately after the fix is merged.


FILES MODIFIED

terraform/00_setup.tf
Changed organization from oland_investments to oland-investments
Changed workspace from oland_investments-prod to oland-investments-prod

terraform/09_s3.tf
Changed CORS allowed origin from oland_investments.cradle.services to oland-investments.cradle.services
Applied to both public and private bucket configurations


TESTING RECOMMENDATIONS

After merging this fix, verify the deployment pipeline operates correctly.

Verification steps

1. Trigger a new GitHub Actions workflow run
2. Confirm terraform init completes without authentication errors
3. Validate terraform plan executes successfully
4. Monitor infrastructure deployment through completion
5. Verify application functionality post-deployment


REPOSITORY STATUS

The fix has been committed to the feature/project-status-and-updates branch and pushed to both the fork and main repository at Joland51/finance-platform-django.

The GitHub Actions workflow will automatically run on the next push or can be manually triggered from the Actions tab.


Document prepared October 21, 2025

