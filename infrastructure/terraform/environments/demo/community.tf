# Cloud Run Service for Community (Blog)
resource "google_cloud_run_v2_service" "community" {
  name     = "${var.app_name}-community"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/${var.project_id}/${var.app_name}-community:latest"
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "community_noauth" {
  location = google_cloud_run_v2_service.community.location
  name     = google_cloud_run_v2_service.community.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Mapping blog domain to the community service
resource "google_cloud_run_domain_mapping" "blog_domain" {
  location = var.region
  name     = var.environment == "prod" ? "blog.migueldev11.com" : "blog.demo.migueldev11.com"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.community.name
  }
}
