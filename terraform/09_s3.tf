

#### Public bucket ####

resource "aws_s3_bucket" "public_bucket" {
  bucket = var.public_bucket_name
}

resource "aws_s3_bucket_versioning" "public_bucket_versioning" {
  bucket = aws_s3_bucket.public_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "public_bucket_access_block" {
  bucket = aws_s3_bucket.public_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
  # depends_on              = [aws_s3_bucket.public_bucket]
}

data "template_file" "s3_public_policy" {
  template = file("templates/s3_public_acl.json.tpl")

  vars = {
    bucket_arn = aws_s3_bucket.public_bucket.arn
  }
}
resource "aws_s3_bucket_policy" "public_bucket_policy" {
  bucket = aws_s3_bucket.public_bucket.id
  policy = data.template_file.s3_public_policy.rendered
  # depends_on = [aws_s3_bucket_public_access_block.public_bucket_access_block]
}


resource "aws_s3_bucket_cors_configuration" "public_bucket_cors" {
  bucket = aws_s3_bucket.public_bucket.id

  cors_rule {
    allowed_headers = ["Authorization", "Content-Type"]
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
}



#### Private bucket ####

resource "aws_s3_bucket" "private_bucket" {
  bucket = var.private_bucket_name
}
resource "aws_s3_bucket_versioning" "private_bucket_versioning" {
  bucket = aws_s3_bucket.private_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}
resource "aws_s3_bucket_public_access_block" "private_bucket_access_block" {
  bucket = aws_s3_bucket.private_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
  # depends_on              = [aws_s3_bucket.private_bucket]
}


resource "aws_s3_bucket_cors_configuration" "private_bucket_cors" {
  bucket = aws_s3_bucket.private_bucket.id

  cors_rule {
    allowed_headers = ["Authorization", "Content-Type"]
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
}



#### Frontend bucket ####

resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "app.${var.root_domain}"
}

resource "aws_s3_bucket_public_access_block" "frontend_bucket_access_block" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
  depends_on              = [aws_s3_bucket.frontend_bucket]
}


resource "aws_s3_bucket_lifecycle_configuration" "private_bucket_lifecycle" {
  bucket = aws_s3_bucket.private_bucket.id

  rule {
    id     = "DeleteVersionsOlderThan2Weeks"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 14
    }
  }
}

data "aws_iam_policy_document" "cloudfront_oac_access" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = ["${aws_s3_bucket.frontend_bucket.arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.frontend_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket     = aws_s3_bucket.frontend_bucket.id
  policy     = data.aws_iam_policy_document.cloudfront_oac_access.json
  depends_on = [aws_s3_bucket_public_access_block.frontend_bucket_access_block]
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id          = aws_vpc.oi_prod_vpc.id
  service_name    = "com.amazonaws.${var.region}.s3"
  route_table_ids = [aws_route_table.private_route_table.id]
}
