# Resell Radar

Trending-products + content-kit platform for Indian resellers.
Frontend in Next.js, backend in Node.js (Express). Two folders, one repo.

```
Cursor/
├── frontend/   # Next.js 14 + TypeScript + Tailwind
└── backend/    # Node.js + Express + TypeScript
```

## Prerequisites

- **Node.js 18.18+ or 20+** (your current `node -v` shows 16.17 — please upgrade first).
  - Easiest: install Node 20 LTS from <https://nodejs.org>
- npm 9+ (comes with Node 18+)

## First-time setup

Open two terminals from the project root.

### 1. Backend (port 4000)

```bash
cd backend
copy .env.example .env       # (Windows) — or `cp .env.example .env` on macOS/Linux
npm install
npm run dev
```

You should see:
```
[resell-radar] API listening on http://localhost:4000
```

Quick check:
- <http://localhost:4000/health>
- <http://localhost:4000/api/products>
- <http://localhost:4000/api/trending>

### 2. Frontend (port 3000)

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>.

## API endpoints (current)

| Method | Path                          | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| GET    | `/health`                     | Health check                 |
| GET    | `/api/products`               | List all products            |
| GET    | `/api/products?category=Kitchen&minMargin=60&maxPrice=1000` | Filter products |
| GET    | `/api/products/:id`           | Get single product           |
| GET    | `/api/trending`               | Top-trending products        |
| GET    | `/api/trending/keywords`      | Trending keywords            |

## Frontend pages

- `/` — Home with hero + today's top picks
- `/products` — All products grid
- `/products/[id]` — Product detail with suppliers + content kit
- `/trending` — Trending sorted by trend score

## Tech stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

**Backend**
- Node.js + Express
- TypeScript (run with `tsx` in dev, `tsc` for build)
- Helmet, CORS, Morgan
- In-memory mock data (swap to Postgres + Prisma later)

## Roadmap

- [ ] Replace mock data with Postgres (Neon / Supabase) + Prisma
- [ ] Admin auth + product CRUD UI
- [ ] LLM-generated content kit (reel hooks, captions, hashtags)
- [ ] Python data pipeline (Google Trends + scrapers) writing to the same DB
- [ ] Filters UI on `/products`
- [ ] Email/WhatsApp signup capture

## Deploy (production)

See **[DEPLOY.md](./DEPLOY.md)** for Neon + Render + Vercel (free tier, API + web only — no Python service required).

## Notes

- Mock images use Unsplash CDN — replace with real product images before production.
- All currency is INR.
- CORS is locked to `http://localhost:3000` in development; update `CORS_ORIGIN` in `backend/.env` for deployed environments.
