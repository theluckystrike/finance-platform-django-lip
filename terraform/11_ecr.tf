resource "aws_ecr_repository" "oi-test-repo" {
  name                 = var.ecr_repo_name
  image_tag_mutability = "IMMUTABLE"
}

resource "aws_ecr_lifecycle_policy" "example" {
  repository = aws_ecr_repository.oi-test-repo.name
  policy     = file("policies/ecr-lifetime-policy.json")
}