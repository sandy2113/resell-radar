-- Discovery & location layer (run on existing DB that already has schema.sql applied)
--   psql "$DATABASE_URL" -f db/migration_002_discovery.sql
--
-- Adds: countries, cities, categories, dealers, product_city_trend, products.category_id

CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  code CHAR(2) NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  country_id INT NOT NULL REFERENCES countries (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  region TEXT
);

CREATE INDEX IF NOT EXISTS idx_cities_country ON cities (country_id);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  tagline TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INT REFERENCES categories (id);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);

CREATE TABLE IF NOT EXISTS dealers (
  id SERIAL PRIMARY KEY,
  city_id INT NOT NULL REFERENCES cities (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area TEXT,
  phone TEXT,
  whatsapp TEXT,
  website TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_dealers_city ON dealers (city_id);

CREATE TABLE IF NOT EXISTS product_city_trend (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  city_id INT NOT NULL REFERENCES cities (id) ON DELETE CASCADE,
  local_trend_score INT NOT NULL,
  local_rank INT,
  UNIQUE (product_id, city_id)
);

CREATE INDEX IF NOT EXISTS idx_pct_city_score ON product_city_trend (city_id, local_trend_score DESC);

-- Seed countries & cities
INSERT INTO countries (code, name) VALUES ('IN', 'India')
ON CONFLICT (code) DO NOTHING;

INSERT INTO cities (country_id, name, slug, region)
SELECT c.id, v.name, v.slug, v.region
FROM countries c
CROSS JOIN (VALUES
  ('Mumbai', 'mumbai', 'Maharashtra'),
  ('Delhi', 'delhi', 'NCT'),
  ('Bengaluru', 'bengaluru', 'Karnataka'),
  ('Hyderabad', 'hyderabad', 'Telangana')
) AS v(name, slug, region)
WHERE c.code = 'IN'
ON CONFLICT (slug) DO NOTHING;

-- Categories (aligned with your product labels)
INSERT INTO categories (slug, name, description, tagline, sort_order) VALUES
  ('home-decor', 'Home Decor', 'Lighting, ambience, and room upgrades that read well on short video.', 'Looks premium, often lean on cost', 10),
  ('kitchen', 'Kitchen', 'Gadgets and storage people use daily — great for short demos.', 'High saves + shareable hooks', 20),
  ('tech-accessories', 'Tech Accessories', 'Chargers, stands, and desk items tied to phone culture.', 'Always relevant to buyers', 30),
  ('health-wellness', 'Health & Wellness', 'Comfort and posture products with clear before/after stories.', 'Obvious “pain → relief” story', 40),
  ('travel', 'Travel', 'Compact travel comfort with steady, year-round interest.', 'Gift-friendly, seasonless', 50)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  tagline = EXCLUDED.tagline,
  sort_order = EXCLUDED.sort_order;

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE p.category_id IS NULL
  AND c.slug = CASE TRIM(p.category)
    WHEN 'Home Decor' THEN 'home-decor'
    WHEN 'Kitchen' THEN 'kitchen'
    WHEN 'Tech Accessories' THEN 'tech-accessories'
    WHEN 'Health & Wellness' THEN 'health-wellness'
    WHEN 'Travel' THEN 'travel'
    ELSE NULL
  END;

-- Dealers (sample; replace with real partners later)
INSERT INTO dealers (city_id, name, area, phone, website, notes)
SELECT ci.id, v.name, v.area, v.phone, v.website, v.notes
FROM cities ci
JOIN (VALUES
  ('mumbai', 'SparkTrade Wholesale', 'Andheri', '+91-90000-10001', 'https://example.com', 'B2B + small lot'),
  ('mumbai', 'Metro Goods Hub', 'Borivali', '+91-90000-10002', 'https://example.com', 'Evening pickup'),
  ('delhi', 'Capital Mart Supply', 'Karol Bagh', '+91-90000-20001', 'https://example.com', 'Bulk pricing'),
  ('delhi', 'NCR Traders', 'Noida', '+91-90000-20002', 'https://example.com', 'Fast restock'),
  ('bengaluru', 'Silicon Sourcing', 'Koramangala', '+91-90000-30001', 'https://example.com', 'Tech catalogue'),
  ('bengaluru', 'South End Wholesale', 'Whitefield', '+91-90000-30002', 'https://example.com', 'Weekend stock drops'),
  ('hyderabad', 'HITEC Trade Line', 'HITEC City', '+91-90000-40001', 'https://example.com', 'Lifestyle + electronics'),
  ('hyderabad', 'Deccan Stockists', 'Secunderabad', '+91-90000-40002', 'https://example.com', 'Regional support')
) AS v(cslug, name, area, phone, website, notes) ON ci.slug = v.cslug
WHERE NOT EXISTS (
  SELECT 1 FROM dealers d
  WHERE d.city_id = ci.id AND d.name = v.name
);

-- Local “heat” scores (dummy) – adjust anytime
INSERT INTO product_city_trend (product_id, city_id, local_trend_score, local_rank)
SELECT v.pid, c.id, v.score, v.rnk
FROM (VALUES
  -- Mumbai
  ('mumbai', 'p-001', 94, 1), ('mumbai', 'p-002', 78, 4), ('mumbai', 'p-003', 88, 2),
  ('mumbai', 'p-004', 72, 5), ('mumbai', 'p-005', 80, 3), ('mumbai', 'p-006', 70, 6),
  -- Delhi
  ('delhi', 'p-001', 92, 1), ('delhi', 'p-002', 76, 4), ('delhi', 'p-003', 86, 2),
  ('delhi', 'p-004', 74, 5), ('delhi', 'p-005', 79, 3), ('delhi', 'p-006', 68, 6),
  -- Bengaluru
  ('bengaluru', 'p-001', 91, 2), ('bengaluru', 'p-002', 80, 4), ('bengaluru', 'p-003', 95, 1),
  ('bengaluru', 'p-004', 73, 5), ('bengaluru', 'p-005', 82, 3), ('bengaluru', 'p-006', 71, 6),
  -- Hyderabad
  ('hyderabad', 'p-001', 90, 1), ('hyderabad', 'p-002', 77, 4), ('hyderabad', 'p-003', 87, 2),
  ('hyderabad', 'p-004', 70, 5), ('hyderabad', 'p-005', 78, 3), ('hyderabad', 'p-006', 69, 6)
) AS v(cslug, pid, score, rnk)
JOIN cities c ON c.slug = v.cslug
ON CONFLICT (product_id, city_id) DO UPDATE SET
  local_trend_score = EXCLUDED.local_trend_score,
  local_rank = EXCLUDED.local_rank;
