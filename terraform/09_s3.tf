

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

resource "aws_s3_bucket_public_access_block" "pulic_bucket_access_block" {
  bucket = aws_s3_bucket.public_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
resource "aws_s3_bucket_policy" "public_bucket_policy" {
  bucket = aws_s3_bucket.public_bucket.id
  policy = file("policies/s3-public-acl.json")
}


resource "aws_s3_bucket_cors_configuration" "public_bucket_cors" {
  bucket = aws_s3_bucket.public_bucket.id

  cors_rule {
    allowed_headers = ["Authorization", "Content-Type"]
    allowed_methods = ["GET"]
    allowed_origins = [
      "http://localhost",
      "https://www.olandinvestments.com",
      "https://www.olandinvesmentslimited.com",
      "http://localhost:8000",
      "http://localhost:8090",
      "https://oland-investments.cradle.services/",
      "https://${aws_lb.production.dns_name}"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
  depends_on = [aws_lb.production]
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
}


resource "aws_s3_bucket_cors_configuration" "private_bucket_cors" {
  bucket = aws_s3_bucket.private_bucket.id

  cors_rule {
    allowed_headers = ["Authorization", "Content-Type"]
    allowed_methods = ["GET"]
    allowed_origins = [
      "http://localhost",
      "https://www.olandinvestments.com",
      "https://www.olandinvesmentslimited.com",
      "http://localhost:8000",
      "http://localhost:8090",
      "https://oland-investments.cradle.services/",
      "https://${aws_lb.production.dns_name}"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
  depends_on = [aws_lb.production]
}
