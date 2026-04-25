-- Real-time(ish) trend snapshots from the Python pipeline (pytrends → Postgres)
-- Run: psql "$DATABASE_URL" -f db/migration_003_trend_pipeline.sql

CREATE TABLE IF NOT EXISTS pipeline_runs (
  id BIGSERIAL PRIMARY KEY,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  message TEXT
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_started ON pipeline_runs (started_at DESC);

-- Per city + keyword, updated each fetch (0–100 interest from Google Trends region breakdown)
CREATE TABLE IF NOT EXISTS city_trend_snapshot (
  id BIGSERIAL PRIMARY KEY,
  city_id INT NOT NULL REFERENCES cities (id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  interest_raw INT NOT NULL,
  search_volume_proxy INT,
  trend_score INT NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (city_id, keyword)
);

CREATE INDEX IF NOT EXISTS idx_cts_city_fetched ON city_trend_snapshot (city_id, fetched_at DESC);

COMMENT ON TABLE city_trend_snapshot IS
  'Google Trends interest (0-100) by city/keyword from interest_by_region; pipeline upserts.';

COMMENT ON TABLE pipeline_runs IS 'Observability for scheduled Python fetches.';
