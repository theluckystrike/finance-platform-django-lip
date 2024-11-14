import boto3
import click


# these task definitions must match family names from ../terraform/05_ecs.tf
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ecs/client/describe_task_definition.html
def get_current_app_task_definition(client):
    return client.describe_task_definition(taskDefinition="oi-test-app-task")


def get_current_migration_task_definition(client):
    return client.describe_task_definition(taskDefinition="oi-test-migration-task")


def get_current_scraping_task_definition(client):
    return client.describe_task_definition(taskDefinition="oi-test-scraping-task")


def get_current_scripts_update_task_definition(client):
    return client.describe_task_definition(taskDefinition="oi-test-scripts-update-task")


@click.command()
@click.option("--cluster", help="Name of the ECS cluster", required=True)
@click.option("--service", help="Name of the ECS service", required=True)
@click.option("--image", help="Docker image URL for the updated application", required=True)
def deploy(cluster, service, image):
    client = boto3.client("ecs")

    # Fetch the current task definition
    print("Fetching current task definitions...")

    task_responses = [
        get_current_migration_task_definition(client),
        get_current_scraping_task_definition(client),
        get_current_scripts_update_task_definition(client),
    ]

    print("Updating non-service task definitions...")
    # update tasks that are not part of the service and will not be pushed to it
    for response in task_responses:
        containers = [r.copy() for r in response["taskDefinition"]["containerDefinitions"]]
        for container in containers:
            container["image"] = image
        update_response = client.register_task_definition(
            family=response["taskDefinition"]["family"],
            volumes=response["taskDefinition"]["volumes"],
            containerDefinitions=containers,
            cpu=response["taskDefinition"]["cpu"],
            memory=response["taskDefinition"]["memory"],
            networkMode=response["taskDefinition"]["networkMode"],
            requiresCompatibilities=response["taskDefinition"]["requiresCompatibilities"],
            executionRoleArn=response["taskDefinition"]["executionRoleArn"],
            taskRoleArn=response["taskDefinition"]["taskRoleArn"]
        )
        new_task_arn = update_response["taskDefinition"]["taskDefinitionArn"]
        print(
            f"New {response['taskDefinition']['family']} ARN: {new_task_arn}")

    print("\nUpdating service task definitions...")
    # update tasks that are part of the service and will be pushed to it
    app_task_response = get_current_app_task_definition(client)
    app_container_definitions = [
        r.copy() for r in app_task_response["taskDefinition"]["containerDefinitions"]]

    for container in app_container_definitions:
        container["image"] = image
    app_response = client.register_task_definition(
        family=app_task_response["taskDefinition"]["family"],
        volumes=app_task_response["taskDefinition"]["volumes"],
        containerDefinitions=app_container_definitions,
        cpu=app_task_response["taskDefinition"]["cpu"],
        memory=app_task_response["taskDefinition"]["memory"],
        networkMode=app_task_response["taskDefinition"]["networkMode"],
        requiresCompatibilities=app_task_response["taskDefinition"]["requiresCompatibilities"],
        executionRoleArn=app_task_response["taskDefinition"]["executionRoleArn"],
        taskRoleArn=app_task_response["taskDefinition"]["taskRoleArn"]
    )
    new_app_task_arn = app_response["taskDefinition"]["taskDefinitionArn"]
    print(f"New {app_response['taskDefinition']['family']} ARN: {new_app_task_arn}")

    # Update the service with the new task definition
    print("\nUpdating ECS service with new app task definition...")
    client.update_service(
        cluster=cluster, service=service, taskDefinition=new_app_task_arn,
    )
    print("Service updated!")


if __name__ == "__main__":
    deploy()
