variable "employment_recipient_email" {
  description = "Email address that receives employment applications."
  type        = string
  default     = "567498jav@gmail.com"
}

variable "employment_sender_email" {
  description = "Amazon SES identity used to send employment applications."
  type        = string
  default     = "567498jav@gmail.com"
}

variable "employment_additional_allowed_origins" {
  description = "Additional exact origins allowed to call the employment API and upload to S3."
  type        = list(string)
  default     = []
}
