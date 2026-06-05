# Cloud Run Service for Frontend
resource "google_cloud_run_v2_service" "frontend" {
  name     = "${var.app_name}-frontend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/${var.project_id}/${var.app_name}-frontend:latest"
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
  }
}

# Allow public access to Frontend
resource "google_cloud_run_v2_service_iam_member" "frontend_noauth" {
  location = google_cloud_run_v2_service.frontend.location
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Domain Mapping for Portfolio
resource "google_cloud_run_domain_mapping" "portfolio_domain" {
  location = var.region
  name     = var.environment == "prod" ? "migueldev11.com" : "demo.migueldev11.com"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.frontend.name
  }
}

# Domain Mapping for Blog
resource "google_cloud_run_domain_mapping" "blog_domain" {
  location = var.region
  name     = var.environment == "prod" ? "blog.migueldev11.com" : "blog.demo.migueldev11.com"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.frontend.name
  }
}
