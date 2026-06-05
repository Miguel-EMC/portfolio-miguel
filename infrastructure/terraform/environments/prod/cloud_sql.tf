resource "google_sql_database_instance" "main" {
  name             = "${var.app_name}-db-instance"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro" # Basic tier for budget efficiency
    
    ip_configuration {
      ipv4_enabled = true
    }
  }
  
  deletion_protection = false # Set to true for production
}

resource "google_sql_database" "database" {
  name     = var.app_name
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "users" {
  name     = "blog_admin"
  instance = google_sql_database_instance.main.name
  password = "change-me-in-secrets"
}
