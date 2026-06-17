# Domain Mapping for the API
# Note: google_cloud_run_v2_service does not have a native "domain mapping" in v2 yet 
# that works exactly like v1 for all regions easily. 
# We use the Cloud Run Domain Mapping resource (v1 style but works).

resource "google_cloud_run_domain_mapping" "api_domain" {
  location = var.region
  name     = "apiblog.demo.migueldev11.com"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.api.name
  }
}
