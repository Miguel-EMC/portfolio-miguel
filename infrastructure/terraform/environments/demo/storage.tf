# Bucket for static assets (cover images, avatars, etc.)
resource "google_storage_bucket" "assets" {
  name     = "${var.project_id}-blog-assets-demo"
  location = var.region
  
  uniform_bucket_level_access = true
  
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Make assets bucket public (optional, can be managed via Cloud CDN or signed URLs)
resource "google_storage_bucket_iam_member" "public_rule" {
  bucket = google_storage_bucket.assets.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
