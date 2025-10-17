ETF Scraper Review

Pull Request 45


Overview

The pull request introduces ETF holdings data scraping from SSGA XLSX files
Several critical issues require attention before merging


Database Architecture

The migration and model have conflicting unique_together definitions
Migration specifies date, ticker, etf_ticker ordering
Model specifies etf_ticker, date, ticker ordering
This mismatch will cause database constraint failures

Database indexes defined in the model are missing from migrations
Performance will degrade significantly without proper indexing

Field naming contains a typo
ETFS Memebers List data should be ETF Members List Data


Infrastructure Configuration

Terraform references non-existent resources
The code references aws_ecs_cluster.main
Production uses aws_ecs_cluster.production

IAM role names don't match
References aws_iam_role.ecs_events
Should be aws_iam_role.ecs_events_role

Security group naming mismatch
References aws_security_group.ecs_tasks
Should be aws_security_group.ecs_security_group

Task definition points to wrong resource
References aws_ecs_task_definition.data_collection
Should reference aws_ecs_task_definition.scrape


Implementation Details

Network error handling is absent
Downloads will fail silently without proper exception handling
No retry logic for temporary network issues

Data field sizes are insufficient
Ticker fields limited to 6 characters
Some tickers require up to 10 characters
CUSIP and ISIN identifiers need 50 characters
SEDOL should be exactly 7 characters not 15

Python dependencies missing from requirements
pandas library required but not specified
openpyxl needed for Excel parsing

Temporary file management needs improvement
Files may not be cleaned up if exceptions occur
Context managers would ensure proper cleanup


Quality Assurance

No unit tests provided for new functionality
No integration tests for database operations
Frontend test failures indicate CI pipeline issues


Priority Actions

Fix database schema consistency immediately
Add missing Python dependencies
Correct all Terraform resource references
Implement proper error handling


Secondary Improvements

Expand field sizes to accommodate real data
Add comprehensive test coverage
Implement data validation logic
Create dedicated ECS task for ETF scraping


Testing Requirements

Verify migration executes successfully
Test with live SSGA data sources
Validate Terraform configuration
Confirm CloudWatch scheduling works
Test error scenarios and edge cases


Risk Analysis

High risk items
Database schema conflicts will cause runtime failures
Missing dependencies prevent deployment
Terraform errors block infrastructure updates

Medium risk items
Network errors cause incomplete data collection
Field truncation loses critical information

Low risk items
Cosmetic issues in admin interface
Missing documentation


Assessment

The functionality adds value to the platform
Critical issues must be resolved before production deployment
With proper fixes this becomes a reliable data source


Recommendation

Request changes before approval
Apply critical fixes from accompanying implementation guide
Resubmit for review after corrections