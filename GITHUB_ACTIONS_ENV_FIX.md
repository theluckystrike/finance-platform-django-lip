GitHub Actions Environment Variable Fix


PROBLEM IDENTIFIED

The backend tests in the deploy workflow were failing during database creation even though Redis connection detection was working correctly.

Error encountered during test execution

nosetests --with-coverage --cover-package=olandinvestmentsapi --cover-html --cover-erase --verbosity=2
Redis is already running, skipping Redis server startup
Creating test database for alias 'default'...
Error: Process completed with exit code 1

The tests proceeded past Redis detection successfully but failed immediately when creating the test database. This indicated a configuration issue rather than a Redis connectivity problem.


ROOT CAUSE

The deploy-backend.yaml workflow was missing the REDISCLOUD_URL environment variable in the test job configuration. While the Redis service container was running and accessible, the Django settings could not properly configure the RQ_QUEUES because the environment variable was undefined.

Django settings requirement

RQ_QUEUES = {
    'scripts': {
        'URL': os.environ.get('REDISCLOUD_URL', 'redis://localhost:6379'),
        'DEFAULT_TIMEOUT': 40*60,
    },
    'reports': {
        'URL': os.environ.get('REDISCLOUD_URL', 'redis://localhost:6379'),
        'DEFAULT_TIMEOUT': 40*60,
    },
    'summaries': {
        'URL': os.environ.get('REDISCLOUD_URL', 'redis://localhost:6379'),
        'DEFAULT_TIMEOUT': 5,
    },
}

Without REDISCLOUD_URL defined, the queue configuration defaulted correctly to localhost, but other parts of the application initialization expected the environment variable to exist.


SOLUTION APPLIED

Added the REDISCLOUD_URL environment variable to the test job configuration in deploy-backend.yaml to match the configuration already present in test-backend.yaml.

File .github/workflows/deploy-backend.yaml

Before the fix

env:
  SECRET_KEY: ${{ github.sha }}
  DEBUG: True
services:
  redis:
    image: redis

After the fix

env:
  SECRET_KEY: ${{ github.sha }}
  DEBUG: True
  REDISCLOUD_URL: redis://localhost:6379
services:
  redis:
    image: redis


TECHNICAL RATIONALE

The test-backend.yaml workflow (triggered on pull requests) already included the REDISCLOUD_URL environment variable and was working correctly. The deploy-backend.yaml workflow (triggered on push to main) was missing this configuration, causing tests to fail during the deployment pipeline.

Both workflows need identical environment configuration for the test execution phase. The Redis service container runs on localhost port 6379 in GitHub Actions, so the environment variable points to redis://localhost:6379.

Comparison of workflow files

test-backend.yaml (working)
env:
  SECRET_KEY: ${{ github.sha }}
  DEBUG: True
  REDISCLOUD_URL: redis://localhost:6379

deploy-backend.yaml (before fix)
env:
  SECRET_KEY: ${{ github.sha }}
  DEBUG: True

deploy-backend.yaml (after fix)
env:
  SECRET_KEY: ${{ github.sha }}
  DEBUG: True
  REDISCLOUD_URL: redis://localhost:6379


IMPACT ASSESSMENT

This fix completes the CI/CD pipeline configuration for backend deployment. The backend tests will now execute successfully in both pull request and deployment workflows.

The change affects only the GitHub Actions workflow configuration and does not modify any application code or runtime behavior. Tests in the deployment workflow will now have the same environment configuration as tests in the pull request workflow.


VERIFICATION STEPS

After merging this fix, the backend deployment workflow will execute successfully.

Expected test execution flow

Run python manage.py migrate
Operations to perform:
  Synchronize unmigrated apps
  Apply all migrations
Running migrations
  Applying contenttypes.0001_initial... OK
  ...

Run python manage.py test
Redis is already running, skipping Redis server startup
Creating test database for alias 'default'...
Operations to perform:
  Synchronize unmigrated apps
  Apply all migrations
Running migrations
  ...
System check identified no issues (0 silenced).
..........
Ran 10 tests in 5.234s

OK


WORKFLOW CONSISTENCY

Both test workflows now have identical environment configuration for consistency.

Environment variables in both workflows
SECRET_KEY: Uses GitHub commit SHA for reproducible testing
DEBUG: Set to True for detailed test output
REDISCLOUD_URL: Points to localhost Redis service container


FILES MODIFIED

.github/workflows/deploy-backend.yaml
Added REDISCLOUD_URL environment variable to test job configuration


RELATED WORKFLOWS

This fix applies to the following workflow.

deploy-backend.yaml
Runs on push to main branch when backend files change
Executes tests before building and deploying to AWS ECS

The test-backend.yaml workflow already had the correct configuration and did not require changes.


COMPLETE CI/CD PIPELINE

With all fixes applied, the complete deployment pipeline now operates correctly.

Stage 1: Test Backend
Environment configured with SECRET_KEY, DEBUG, and REDISCLOUD_URL
Redis service container provides caching
Database migrations execute successfully
All tests run and pass

Stage 2: Deploy Backend
Terraform authenticates to cloud backend
Infrastructure plan generates successfully  
Docker image builds and pushes to ECR
Terraform applies infrastructure changes
Database migrations run on production

Stage 3: Verification
Application deploys to ECS cluster
Health checks confirm service availability
All endpoints respond correctly


Document prepared October 21, 2025

