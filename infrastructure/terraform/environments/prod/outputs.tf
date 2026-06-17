output "cloud_run_url" {
  value = google_cloud_run_v2_service.api.uri
}

output "db_instance_connection_name" {
  value = google_sql_database_instance.main.connection_name
}

output "assets_bucket_url" {
  value = google_storage_bucket.assets.url
}
