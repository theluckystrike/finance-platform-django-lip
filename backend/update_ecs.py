import boto3
import click


def get_current_app_task_definition(client):
    return client.describe_task_definition(taskDefinition="oi-test-app-task")


def get_current_migration_task_definition(client):
    return client.describe_task_definition(taskDefinition="oi-test-migration-task")


@click.command()
@click.option("--cluster", help="Name of the ECS cluster", required=True)
@click.option("--service", help="Name of the ECS service", required=True)
@click.option("--image", help="Docker image URL for the updated application", required=True)
def deploy(cluster, service, image):
    client = boto3.client("ecs")

    # Fetch the current task definition
    print("Fetching current task definition...")
    app_response = get_current_app_task_definition(client)
    migration_response = get_current_migration_task_definition(client)
    app_container_definitions = [
        r.copy() for r in app_response["taskDefinition"]["containerDefinitions"]]
    
    migration_container_definitions = [
        r.copy() for r in migration_response["taskDefinition"]["containerDefinitions"]]

    # Update the container definition with the new image
    for cdef in app_container_definitions:
        cdef["image"] = image
    for cdef in migration_container_definitions:
        cdef["image"] = image

    print(f"Updated image to: {image}")

    # Register a new task definition
    print("Registering new migration task definition...")
    migration_response = client.register_task_definition(
        family=migration_response["taskDefinition"]["family"],
        volumes=migration_response["taskDefinition"]["volumes"],
        containerDefinitions=migration_container_definitions,
        cpu="1024",
        memory="3072",
        networkMode="awsvpc",
        requiresCompatibilities=["FARGATE"],
        executionRoleArn="ecs_task_execution_role_prod",
        taskRoleArn="ecs_task_execution_role_prod"
    )
    new_migration_task_arn = migration_response["taskDefinition"]["taskDefinitionArn"]
    print(f"New migration task definition ARN: {new_migration_task_arn}")

    print("Registering new app task definition...")
    app_response = client.register_task_definition(
        family=app_response["taskDefinition"]["family"],
        volumes=app_response["taskDefinition"]["volumes"],
        containerDefinitions=app_container_definitions,
        cpu="1024",
        memory="3072",
        networkMode="awsvpc",
        requiresCompatibilities=["FARGATE"],
        executionRoleArn="ecs_task_execution_role_prod",
        taskRoleArn="ecs_task_execution_role_prod"
    )
    new_app_task_arn = app_response["taskDefinition"]["taskDefinitionArn"]
    print(f"New app task definition ARN: {new_app_task_arn}")

    # Update the service with the new task definition
    print("Updating ECS service with new app task definition...")
    client.update_service(
        cluster=cluster, service=service, taskDefinition=new_app_task_arn,
    )
    print("Service updated!")


if __name__ == "__main__":
    deploy()
