# 🧱 BCW Monorepo

This project is a full-stack monorepo containing:

- **Backend** — NestJS API server (`/backend`)
- **Frontend** — Vite + React client (`/frontend`)
- **Docker Setup** — For unified development and deployment (`/docker` and root `docker-compose.yml`)

---

## 🚀 Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd monorepo
   ```
2. **Copy and edit environment files**
    ```cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    cp docker/.env.example docker/.env
    ```

**RUN the project through below command**
```docker compose up --build```