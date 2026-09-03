data "aws_caller_identity" "current" {}

data "archive_file" "employment_lambda" {
  type = "zip"

  source {
    content  = file("${path.module}/lambda/employment/index.mjs")
    filename = "index.mjs"
  }

  source {
    content  = file("${path.module}/lambda/employment/core.mjs")
    filename = "core.mjs"
  }

  output_path = "${path.module}/.terraform/employment-lambda.zip"
}

locals {
  employment_allowed_origins = distinct(concat([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://${aws_cloudfront_distribution.tesi_web.domain_name}",
  ], var.employment_additional_allowed_origins))
  employment_name = "tesi-employment"
}

resource "aws_s3_bucket" "employment_cv" {
  bucket        = "tesi-employment-cv-${data.aws_caller_identity.current.account_id}"
  force_destroy = false
}

resource "aws_s3_bucket_public_access_block" "employment_cv" {
  bucket = aws_s3_bucket.employment_cv.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "employment_cv" {
  bucket = aws_s3_bucket.employment_cv.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "employment_cv" {
  bucket = aws_s3_bucket.employment_cv.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "employment_cv" {
  bucket = aws_s3_bucket.employment_cv.id

  rule {
    id     = "delete-employment-files-after-30-days"
    status = "Enabled"

    filter {}

    expiration {
      days = 30
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "employment_cv" {
  bucket = aws_s3_bucket.employment_cv.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["POST"]
    allowed_origins = local.employment_allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 300
  }
}

resource "aws_s3_bucket_policy" "employment_cv" {
  bucket = aws_s3_bucket.employment_cv.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "DenyInsecureTransport"
      Effect    = "Deny"
      Principal = "*"
      Action    = "s3:*"
      Resource = [
        aws_s3_bucket.employment_cv.arn,
        "${aws_s3_bucket.employment_cv.arn}/*",
      ]
      Condition = {
        Bool = {
          "aws:SecureTransport" = "false"
        }
      }
    }]
  })
}

resource "aws_sesv2_email_identity" "employment_sender" {
  email_identity = var.employment_sender_email
}

resource "aws_iam_role" "employment_lambda" {
  name = "${local.employment_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "employment_lambda" {
  name = "${local.employment_name}-lambda-policy"
  role = aws_iam_role.employment_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "EmploymentCvObjects"
        Effect = "Allow"
        Action = [
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:PutObject",
        ]
        Resource = "${aws_s3_bucket.employment_cv.arn}/*"
      },
      {
        Sid      = "SendEmploymentEmail"
        Effect   = "Allow"
        Action   = "ses:SendRawEmail"
        Resource = aws_sesv2_email_identity.employment_sender.arn
      },
      {
        Sid    = "WriteEmploymentLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "${aws_cloudwatch_log_group.employment_lambda.arn}:*"
      },
    ]
  })
}

resource "aws_cloudwatch_log_group" "employment_lambda" {
  name              = "/aws/lambda/${local.employment_name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "employment" {
  function_name = local.employment_name
  role          = aws_iam_role.employment_lambda.arn
  runtime       = "nodejs22.x"
  handler       = "index.handler"
  architectures = ["arm64"]
  memory_size   = 256
  timeout       = 30

  filename         = data.archive_file.employment_lambda.output_path
  source_code_hash = data.archive_file.employment_lambda.output_base64sha256

  environment {
    variables = {
      ALLOWED_ORIGINS = join(",", local.employment_allowed_origins)
      CV_BUCKET       = aws_s3_bucket.employment_cv.id
      SES_RECIPIENT   = var.employment_recipient_email
      SES_SENDER      = var.employment_sender_email
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.employment_lambda,
    aws_iam_role_policy.employment_lambda,
  ]
}

resource "aws_apigatewayv2_api" "employment" {
  name          = local.employment_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["content-type"]
    allow_methods = ["POST"]
    allow_origins = local.employment_allowed_origins
    max_age       = 300
  }
}

resource "aws_apigatewayv2_integration" "employment" {
  api_id                 = aws_apigatewayv2_api.employment.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.employment.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
  timeout_milliseconds   = 30000
}

resource "aws_apigatewayv2_route" "employment_upload" {
  api_id    = aws_apigatewayv2_api.employment.id
  route_key = "POST /employment/upload"
  target    = "integrations/${aws_apigatewayv2_integration.employment.id}"
}

resource "aws_apigatewayv2_route" "employment_submit" {
  api_id    = aws_apigatewayv2_api.employment.id
  route_key = "POST /employment/submit"
  target    = "integrations/${aws_apigatewayv2_integration.employment.id}"
}

resource "aws_cloudwatch_log_group" "employment_api" {
  name              = "/aws/apigateway/${local.employment_name}"
  retention_in_days = 14
}

resource "aws_apigatewayv2_stage" "employment" {
  api_id      = aws_apigatewayv2_api.employment.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 5
    throttling_rate_limit  = 2
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.employment_api.arn
    format = jsonencode({
      requestId        = "$context.requestId"
      routeKey         = "$context.routeKey"
      status           = "$context.status"
      responseLength   = "$context.responseLength"
      integrationError = "$context.integrationErrorMessage"
    })
  }
}

resource "aws_lambda_permission" "employment_api" {
  statement_id  = "AllowEmploymentApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.employment.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.employment.execution_arn}/*/*"
}
