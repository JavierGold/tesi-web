output "employment_api_url" {
  description = "Base URL for VITE_EMPLOYMENT_API_URL."
  value       = aws_apigatewayv2_api.employment.api_endpoint
}

output "employment_cv_bucket" {
  description = "Private bucket used for employment CV files."
  value       = aws_s3_bucket.employment_cv.id
}

output "employment_ses_identity" {
  description = "SES sender identity used by the employment Lambda."
  value       = aws_sesv2_email_identity.employment_sender.email_identity
}
