resource "aws_ses_domain_identity" "domain" {
  domain = var.root_domain
}

resource "aws_route53_record" "domain_verification_record" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_amazonses.${var.root_domain}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.domain.verification_token]
}

resource "aws_ses_domain_dkim" "email_dkim" {
  domain = aws_ses_domain_identity.domain.domain
}


resource "aws_route53_record" "ses_dkim" {
  for_each = toset(aws_ses_domain_dkim.email_dkim.dkim_tokens)
  zone_id  = aws_route53_zone.main.zone_id
  name     = "${each.value}._domainkey.${aws_ses_domain_identity.domain.domain}"
  type     = "CNAME"
  ttl      = 300
  records  = ["${each.value}.dkim.amazonses.com"]
}

# resource "aws_ses_email_identity" "no_reply" {
#   email = "no-reply@${var.root_domain}"
# }