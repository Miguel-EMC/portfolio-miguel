# Basic configuration for Cloud Run
resource "google_cloud_run_v2_service" "api" {
  name     = "${var.app_name}-api"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/${var.project_id}/${var.app_name}-api:latest"
      
      env {
        name  = "ENVIRONMENT"
        value = var.environment
      }
      # Database connection will be added here
    }
  }
}

# Allow unauthenticated access (for public API)
resource "google_cloud_run_v2_service_iam_member" "noauth" {
  location = google_cloud_run_v2_service.api.location
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
