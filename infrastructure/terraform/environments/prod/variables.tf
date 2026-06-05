variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "migueldev-community-platform"
}

variable "region" {
  description = "The GCP region to deploy resources"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name (e.g. prod, dev)"
  type        = string
  default     = "prod"
}

variable "app_name" {
  description = "The name of the application"
  type        = string
  default     = "migueldev-blog"
}
