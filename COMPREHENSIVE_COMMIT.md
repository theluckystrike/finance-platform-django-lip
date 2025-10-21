Fix Python executable path in test runner and update authentication test URLs

Project Scope and Status Update

Scope Overview

Create public site and private site with the following requirements

Public Site Structure
Two tabs visible on public interface
Tab 1 US Stock Market Returns replacing current dashboard
Tab 2 User Portal for authentication access

US Stock Market Returns Tab Requirements
Replace icon cards with comprehensive comparison table
Table columns Index name, Index ticker, Market cap if available, YTD return, 1m, 3m, 6m, 1y
Each index ticker provides hyperlink to member details dashboard
Enable clear index comparison and drill down analysis capability

User Portal Tab Requirements  
Provide standard login credentials interface
Add Sign up button with temporary message
Display please check back for more information for registration attempts

Implementation Status Summary

1. Public and Private Site Creation

Backend architecture for public and private access complete
User authentication API with registration and login deployed
Frontend routing structure separating public and authenticated routes established

2. Public Site Tabbed Interface

Primary UI gap Current public page shows dashboard cards not two tab interface
Implementation scheduled as next priority

3. US Stock Market Returns Tab

Comparison table not yet implemented using card layout currently
Drill down functionality partially complete for SP 500 with sortable member view
Component ready for templating to NASDAQ 100 DJIA Russell 2000

Data Collection Infrastructure
Backend data collection 100 percent complete and automated
Four production scripts configured for daily AWS execution
SP 500 NASDAQ 100 DJIA Russell 2000 sample
Data pipeline robust and ready
Frontend using mock data pending API connection

4. User Portal Tab

Backend authentication API fully functional
Standalone login page exists but not integrated into public homepage
Registration API complete secure and ready
Sign up button and placeholder message pending implementation

Technical Fixes Applied

Test Runner Improvements
Fixed Python executable path using sys.executable instead of hardcoded python
Added exception handling for RQ worker startup failures
Improved Redis server startup error handling

Authentication Test Updates
Corrected all test URLs to match registered patterns
Fixed endpoint names refresh token user info
Removed trailing slashes from test URLs
Resolved 404 errors in GitHub Actions tests

Remaining Implementation Tasks

Create two tab interface on public homepage
Build index comparison table for Market Returns tab
Integrate User Portal tab with login functionality
Add Sign up button with placeholder message
Connect frontend to live backend APIs
Remove mock data dependencies

Files Modified
backend/olandinvestmentsapi/tests/test_runner.py
backend/olandinvestmentsapi/tests/auth_views_tests.py
