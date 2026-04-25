# Deploy (free tier, no Python pipeline)

Stack: **Neon** (Postgres) + **Render** (Express API) + **Vercel** (Next.js). The Python trends job is optional; skip it in production unless you add a scheduler later.

## 1. Database (Neon — free)

1. Create a project at [https://neon.tech](https://neon.tech) and create a database.
2. Copy the **connection string** (use `sslmode=require` in the URL if offered).
3. In Neon’s **SQL Editor**, run these files **in order** against your database:
   - `backend/db/schema.sql`
   - `backend/db/migration_002_discovery.sql`
   - `backend/db/migration_003_trend_pipeline.sql`
   - `backend/db/seed.sql`
   - `backend/db/migration_004_catalog_twenty_per_city.sql`  
   Or use `psql` locally with the same URL.

## 2. API (Render — free web service)

1. Push this repo to GitHub (root should contain `backend/`, `frontend/`, `render.yaml`).
2. [Render](https://render.com) → **New** → **Blueprint** (or **Web Service** if you prefer manual setup).
3. If using the Blueprint, connect the repo; Render reads `render.yaml`.
4. In the service **Environment**, set:
   - **`DATABASE_URL`** — your Neon URL (with `sslmode=require` if required).
   - **`DATABASE_SSL`** — set to `true` if your host needs SSL and the URL does not already force it.
   - **`CORS_ORIGIN`** — your Vercel URL, e.g. `https://your-app.vercel.app` (no trailing slash). For preview branches you can use `https://*.vercel.app` only if you change CORS to support multiple origins; for a first deploy use a single production URL.
5. Deploy. Note the public URL, e.g. `https://resell-radar-api.onrender.com`.

**Free tier:** the service **spins down** when idle; the first request after sleep can take ~30–60s.

**Health checks:** `GET /health` and `GET /health/db` (database must be reachable).

## 3. Frontend (Vercel — Hobby)

1. [Vercel](https://vercel.com) → **Add New Project** → import the same GitHub repo.
2. **Root Directory:** `frontend`
3. **Environment variables (Production):**
   - **`NEXT_PUBLIC_API_URL`** — your Render API base URL only, e.g. `https://resell-radar-api.onrender.com` (no `/api` suffix).
4. Deploy. After the first deploy, if the API URL changed, update `NEXT_PUBLIC_API_URL` and redeploy.

## 4. Verify

- Open `https://<your-api>.onrender.com/health` and `/health/db`.
- Open the Vercel site; home and `/trending` should load products from Postgres.

## Optional: Python pipeline later

Run `pipeline/job.py` on a schedule (e.g. GitHub Actions cron) with the same `DATABASE_URL`, or leave it off — the app works with seeded + static trend data.
