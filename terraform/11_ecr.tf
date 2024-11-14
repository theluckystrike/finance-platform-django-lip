resource "aws_ecr_lifecycle_policy" "example" {
  repository = "oi-test"

  policy = file("policies/ecr-lifetime-policy.json")
}