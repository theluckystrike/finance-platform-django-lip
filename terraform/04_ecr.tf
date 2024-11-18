# resource "aws_ecr_repository" "ecr_repo" {
#   name                 = var.ecr_repo_name
#   image_tag_mutability = "IMMUTABLE"
# }

resource "aws_ecr_lifecycle_policy" "no-more-than-5" {
  repository = "oi-prod-repo"
  policy     = file("policies/ecr-lifetime-policy.json")
}
