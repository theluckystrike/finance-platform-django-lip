resource "aws_s3_bucket" "public_bucket" {
  bucket = var.public_bucket_name
  acl    = "public-read"
}

resource "aws_s3_bucket" "private_bucket" {
  bucket = var.private_bucket_name
  acl    = "private"
}

resource "aws_s3_bucket_cors_configuration" "private_bucket_cors" {
  bucket = aws_s3_bucket.private_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = [
      "http://localhost",
      "https://www.olandinvestments.com",
      "https://www.olandinvesmentslimited.com",
      "http://localhost:8000",
      "http://localhost:8090",
      "https://oland-investments.cradle.services/",
      aws_lb.production.dns_name
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
  depends_on = [aws_lb.production]
}
resource "aws_s3_bucket_cors_configuration" "public_bucket_cors" {
  bucket = aws_s3_bucket.public_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = [
      "http://localhost",
      "https://www.olandinvestments.com",
      "https://www.olandinvesmentslimited.com",
      "http://localhost:8000",
      "http://localhost:8090",
      "https://oland-investments.cradle.services/",
      aws_lb.production.dns_name
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
  depends_on = [aws_lb.production]
}
