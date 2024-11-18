resource "aws_acm_certificate" "cert" {
  domain_name       = var.root_domain
  validation_method = "DNS"

  subject_alternative_names = ["www.${var.root_domain}"]

  tags = {
    Name = "oi_prod_domain_certificate"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# # Declare the Route 53 zone for the domain
resource "aws_route53_zone" "main" {
  name = var.root_domain
}



# # Define the Route 53 records for certificate validation
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

# Define the Route 53 records for the domain and its www subdomain
resource "aws_route53_record" "root_record" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.root_domain
  type    = "A"

  alias {
    name                   = aws_lb.production.dns_name
    zone_id                = aws_lb.production.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "www_record" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.root_domain}"
  type    = "A"

  alias {
    name                   = aws_lb.production.dns_name
    zone_id                = aws_lb.production.zone_id
    evaluate_target_health = true
  }
}

# Define the certificate validation resource
resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
