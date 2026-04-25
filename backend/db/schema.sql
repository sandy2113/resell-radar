-- Resell Radar: PostgreSQL schema
-- Run: psql -U postgres -d your_db -f db/schema.sql
-- (or: psql "postgresql://user:pass@host:port/db" -f db/schema.sql)

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cost_price INTEGER NOT NULL,
  selling_price INTEGER NOT NULL,
  profit_margin INTEGER NOT NULL,
  trend_score INTEGER NOT NULL,
  demand_score INTEGER NOT NULL,
  competition_level TEXT NOT NULL CHECK (competition_level IN ('low', 'medium', 'high')),
  target_audience TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  price INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_suppliers_product_id ON suppliers (product_id);

CREATE TABLE IF NOT EXISTS product_content (
  product_id TEXT PRIMARY KEY REFERENCES products (id) ON DELETE CASCADE,
  reel_hook TEXT NOT NULL,
  demo_idea TEXT NOT NULL,
  caption TEXT NOT NULL,
  hashtags TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS trend_keywords (
  id SERIAL PRIMARY KEY,
  keyword TEXT NOT NULL,
  search_volume INTEGER NOT NULL,
  trend_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (lower(category));
CREATE INDEX IF NOT EXISTS idx_products_trend_score ON products (trend_score DESC);
