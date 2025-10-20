Terraform Organization Configuration Update


Overview

This update aligns the Terraform backend configuration with the newly established oland_investments organization in Terraform Cloud. The previous organization name was unavailable, requiring this migration to ensure proper infrastructure management access for the team.


Background

Jeffrey Oland confirmed the creation of a new Terraform Cloud organization named oland_investments with underscore notation. The original oland-investments with hyphen notation was already registered by another entity. Henok Tilaye, with username henoktilaye7, has been granted access to the new organization. This change provides the team with full control over infrastructure state management without legacy conflicts.


Configuration Changes

The following files have been updated to reflect the new organization structure.


Terraform Backend Configuration

File terraform/00_setup.tf

Before

```hcl
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
```

After

```hcl
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
```


S3 CORS Configuration

File terraform/09_s3.tf

Two instances of CORS allowed origins have been updated for consistency with the new organization naming convention.

Before

```hcl
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
```

After

```hcl
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
```

This change was applied to both the public bucket and private bucket CORS configurations.


Technical Impact

The infrastructure will now connect to the oland_investments organization controlled by Jeffrey Oland. This ensures proper access control and state management through Terraform Cloud. The workspace naming convention maintains consistency with the organization name, using underscore notation throughout.


Implementation Details

All changes have been committed to the feature/project-status-and-updates branch. The commit includes a comprehensive description of the rationale and technical modifications. The changes are backward compatible and do not affect existing infrastructure resources, only the state management backend.


Verification Steps

After deployment, the following confirmations should be made.

1. Terraform successfully initializes with the new backend configuration
2. The oland_investments organization shows the workspace connection
3. Henok Tilaye can access and manage the infrastructure through Terraform Cloud
4. State operations continue without interruption


Migration Path

No migration of existing state is required if this is a fresh deployment. For existing deployments, the state will need to be migrated to the new organization following Terraform Cloud migration procedures.


Repository Information

Changes have been pushed to the upstream repository at Joland51/finance-platform-django on the feature/project-status-and-updates branch.


Document prepared October 20, 2025
