# Blog Community Platform Migration Plan

## 1. Background & Motivation
The current blog is a static, file-based feature integrated within the main portfolio application. To support a growing community, the vision is to transform the blog into a fully interactive platform accessible via a dedicated subdomain (`blog.migueldev11.com`). This platform will host articles, full courses, and comprehensive guides, enabling users to log in, leave comments, provide feedback, and receive notifications. The entire system will be managed as a unified Monorepo, with infrastructure provisioned via Terraform on Google Cloud, leveraging existing GitHub Actions.

## 2. Scope & Impact
This is a major architectural shift affecting frontend, backend, and infrastructure:
*   **Monorepo Refactoring:** The repository will be restructured into a true monorepo (using Angular Workspaces/Nx) containing `apps/portfolio`, `apps/blog`, and `backend/`.
*   **Backend Introduction:** A **FastAPI** backend will handle dynamic content, user authentication, and community interactions.
*   **Infrastructure as Code (IaC):** **Terraform** will be introduced to provision Google Cloud resources (Cloud Run for API, Cloud SQL for DB, Cloud Storage for assets).
*   **CI/CD Adaptation:** The existing `.github/workflows/main.yml` (deploying to GitHub Pages on `demo`) will be adapted to support the monorepo structure, and new jobs will be added to deploy the backend to Google Cloud and manage Terraform state.

## 3. Proposed Architecture

### A. Repository Structure (Monorepo)
```
/
├── apps/
│   ├── portfolio/         # Current Angular App
│   └── blog/              # New Angular App for Community
├── libs/                  # Shared Angular UI/Services
├── backend/               # FastAPI Application
├── infrastructure/        # Terraform configurations (GCP)
└── .github/workflows/     # Updated CI/CD pipelines
```

### B. Frontend: Angular Workspace
*   **Workspace:** Utilize Angular CLI to manage `apps/portfolio` and `apps/blog`.
*   **Shared Library:** `libs/ui` will contain design tokens, components (Navbar, Footer), and services to maintain design consistency across both applications.
*   **Routing & Deployment:** `portfolio` deploys to the main domain (or GitHub Pages for demo), while `blog` deploys to `blog.migueldev11.com`.

### C. Backend: FastAPI (Python)
*   **Framework:** FastAPI with Uvicorn.
*   **Database:** PostgreSQL (Cloud SQL on GCP) via SQLAlchemy.
*   **Authentication:** Social OAuth (Google, GitHub) using JWT tokens.
*   **Core Modules:**
    *   **Users/Auth:** Profile management, OAuth flows, role-based access.
    *   **Content:** CRUD operations for Posts, Courses, and Guides.
    *   **Interactions:** Comment threads, upvotes/likes.
    *   **Notifications:** Event-driven notification system.

### D. Infrastructure: Terraform on Google Cloud
*   **Compute:** **Google Cloud Run** to host the containerized FastAPI backend.
*   **Database:** **Google Cloud SQL (PostgreSQL)** for relational data.
*   **Storage:** **Google Cloud Storage** for user avatars, course assets, and post cover images.
*   **State Management:** Terraform state stored securely in a GCP Storage bucket.

## 4. Implementation Plan

### Phase 1: Infrastructure & Backend Foundation
1.  Initialize the `infrastructure/` directory with Terraform configurations for GCP (Cloud SQL, Cloud Run, Storage, Service Accounts).
2.  Set up GitHub Actions secrets for GCP authentication (`gcloud` CLI is available).
3.  Containerize the `backend/` FastAPI application using Docker.
4.  Implement core FastAPI endpoints and SQLAlchemy models (Users, Posts).

### Phase 2: Frontend Monorepo Restructuring
1.  Migrate the current Angular project root into an `apps/portfolio` structure using `ng generate application`.
2.  Create `apps/blog` within the workspace.
3.  Extract common components (Navbar, Footer, CSS variables) into a shared `libs/` directory.
4.  Update the existing `.github/workflows/main.yml` to build `apps/portfolio` and deploy it to GitHub pages (maintaining current demo flow).

### Phase 3: Blog Community Features
1.  Integrate Google/GitHub OAuth login flow into the `apps/blog` frontend and FastAPI backend.
2.  Develop the Blog Home, Course List, and Single Post views connecting to the FastAPI backend.
3.  Implement the comment section and interactive feedback UI.
4.  Create a secure Admin dashboard in the frontend for content creation.

### Phase 4: CI/CD & Data Migration
1.  Expand GitHub Actions to include Terraform `plan`/`apply` steps and Cloud Run deployments for the backend.
2.  Write a Python script within `backend/` to parse existing Markdown files in the `assets/` folder and seed them into the Cloud SQL database.
3.  Configure custom domains mapping Cloud Run endpoints and frontend apps.

## 5. Verification
*   **Backend:** Pytest for API endpoints and auth flows.
*   **Frontend:** Jasmine/Karma tests ensuring shared libraries work across both apps.
*   **Infrastructure:** Terraform `plan` verification in PRs before applying to `demo` or `main`.