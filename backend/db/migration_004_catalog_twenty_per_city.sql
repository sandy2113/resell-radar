-- Extends the curated catalogue to 20 products and ties each city to all 20 rows in
-- product_city_trend (rotated local_rank so the board differs by city). Google Trends
-- does not return product SKUs; "real-time" in the app = keyword + DB pipeline, plus
-- this per-city list for UX.
-- Run: psql "$DATABASE_URL" -f db/migration_004_catalog_twenty_per_city.sql

BEGIN;

-- 14 additional products (p-001..p-006 assumed present from earlier seed)
INSERT INTO products (id, name, category, description, image_url, cost_price, selling_price, profit_margin, trend_score, demand_score, competition_level, target_audience, created_at) VALUES
  ('p-007', 'RGB LED Strip 5m with Remote', 'Home Decor', 'Room ambient strip for reels and B-roll; strong gifting demand.', 'https://images.unsplash.com/photo-1565814329452-e1efa0c4f76c?w=800', 190, 649, 70, 84, 80, 'medium', 'Students, gamers, home studios', '2024-12-20T10:00:00Z'),
  ('p-008', 'Insulated Steel Water Bottle 1L', 'Health & Wellness', 'Leakproof bottle for gym and travel; evergreen niche.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800', 220, 599, 63, 72, 78, 'high', 'Gym goers, office commute', '2024-12-20T10:00:00Z'),
  ('p-009', 'Car Dashboard Phone Mount', 'Tech Accessories', 'Suction or vent mount; high search intent year-round.', 'https://images.unsplash.com/photo-1611269154421-8c99e8f5e7e0?w=800', 90, 349, 74, 78, 81, 'high', 'Delivery riders, car owners', '2024-12-20T10:00:00Z'),
  ('p-010', 'Stainless 3-Compartment Tiffin', 'Kitchen', 'Office lunch set; family-friendly demos.', 'https://images.unsplash.com/photo-1584269632625-c2a0cc56b2bb?w=800', 280, 799, 64, 76, 74, 'medium', 'Office workers, parents', '2024-12-20T10:00:00Z'),
  ('p-011', 'Blue Light Blocking Glasses', 'Health & Wellness', 'WFM eye strain; clear before/after on screen time.', 'https://images.unsplash.com/photo-1572635196237-4b0d5e6d4c5d?w=800', 120, 449, 73, 77, 79, 'medium', 'Students, devs, streamers', '2024-12-20T10:00:00Z'),
  ('p-012', 'Handheld Garment Steamer Mini', 'Home Decor', 'Quick wrinkle release for shoots and OOTD.', 'https://images.unsplash.com/photo-1527515635722-256025f9ef31?w=800', 650, 1899, 65, 73, 71, 'low', 'Bachelor pads, small shops', '2024-12-20T10:00:00Z'),
  ('p-013', 'TWS True Wireless Earbuds', 'Tech Accessories', 'TWS in budget; huge volume category; bundle-friendly.', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', 350, 999, 64, 88, 86, 'high', 'Commuters, students', '2024-12-20T10:00:00Z'),
  ('p-014', 'Shampoo Scalp Silicone Massager', 'Health & Wellness', 'Satisfying texture content; hair care upsell.', 'https://images.unsplash.com/photo-1522337360786-1f7e0d0e4e0d?w=800', 80, 299, 73, 70, 75, 'medium', 'Salon at home, self-care', '2024-12-20T10:00:00Z'),
  ('p-015', 'Digital Luggage Weighing Scale', 'Travel', 'Pre-flight must-have; compact hook design.', 'https://images.unsplash.com/photo-1585386959984-41552b3d0e6e?w=800', 200, 599, 66, 71, 72, 'medium', 'Travelers, families', '2024-12-20T10:00:00Z'),
  ('p-016', '10 inch LED Ring Light with Stand', 'Tech Accessories', 'Creator staple; great hook lighting.', 'https://images.unsplash.com/photo-1526170375885-4d8ec66e19a7?w=800', 450, 1299, 65, 86, 83, 'medium', 'Creators, resellers, tutors', '2024-12-20T10:00:00Z'),
  ('p-017', 'Aloe Vera Gel 300g Pump', 'Health & Wellness', 'Skin calm content; high repeat intent.', 'https://images.unsplash.com/photo-1556228574-0e0d7a5e0e0e?w=800', 100, 349, 71, 69, 77, 'high', 'Skincare buyers, post-sun', '2024-12-20T10:00:00Z'),
  ('p-018', 'Reusable Silicone Stretch Lids Set', 'Kitchen', 'Zero waste story; top-down demo.', 'https://images.unsplash.com/photo-1584269632625-c2a0cc56b2bb?w=800', 150, 499, 69, 75, 73, 'medium', 'Kitchen hacks audience', '2024-12-21T10:00:00Z'),
  ('p-019', 'Over-Ear Bluetooth Headphones', 'Tech Accessories', 'WFM and travel comfort; unboxing-friendly.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 800, 2499, 68, 82, 84, 'high', 'Audiophiles, students', '2024-12-21T10:00:00Z'),
  ('p-020', 'Portable Car Vacuum 12V', 'Home Decor', 'Crumb-busting car interior; satisfying macro shots.', 'https://images.unsplash.com/photo-1621905251918-48416b8570c5?w=800', 420, 1199, 64, 74, 76, 'medium', 'Car owners, parents', '2024-12-21T10:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  cost_price = EXCLUDED.cost_price,
  selling_price = EXCLUDED.selling_price,
  profit_margin = EXCLUDED.profit_margin,
  trend_score = EXCLUDED.trend_score,
  demand_score = EXCLUDED.demand_score,
  competition_level = EXCLUDED.competition_level,
  target_audience = EXCLUDED.target_audience;

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
  END
  AND p.id IN ('p-007', 'p-008', 'p-009', 'p-010', 'p-011', 'p-012', 'p-013', 'p-014', 'p-015', 'p-016', 'p-017', 'p-018', 'p-019', 'p-020');

-- One supplier per new SKU (re-runs skip duplicates)
INSERT INTO suppliers (product_id, name, url, price)
SELECT v.pid, v.nm, v.u, v.pr
FROM (VALUES
  ('p-007', 'Meesho', 'https://www.meesho.com/search?q=led+strip+5m', 210),
  ('p-008', 'Meesho', 'https://www.meesho.com/search?q=insulated+water+bottle+1l', 240),
  ('p-009', 'IndiaMART', 'https://dir.indiamart.com/search.mp?ss=car+phone+mount', 110),
  ('p-010', 'Meesho', 'https://www.meesho.com/search?q=steel+tiffin+3+compartment', 300),
  ('p-011', 'Meesho', 'https://www.meesho.com/search?q=blue+light+glasses', 140),
  ('p-012', 'IndiaMART', 'https://dir.indiamart.com/search.mp?ss=handheld+garment+steamer', 720),
  ('p-013', 'Meesho', 'https://www.meesho.com/search?q=tws+earbuds', 380),
  ('p-014', 'Alibaba', 'https://www.alibaba.com/trade/search?SearchText=scalp+massager', 95),
  ('p-015', 'Meesho', 'https://www.meesho.com/search?q=luggage+scale+digital', 220),
  ('p-016', 'IndiaMART', 'https://dir.indiamart.com/search.mp?ss=ring+light+10+inch', 500),
  ('p-017', 'Meesho', 'https://www.meesho.com/search?q=aloe+vera+gel+300g', 120),
  ('p-018', 'Alibaba', 'https://www.alibaba.com/trade/search?SearchText=silicone+stretch+lids', 180),
  ('p-019', 'Meesho', 'https://www.meesho.com/search?q=over+ear+bluetooth+headphones', 900),
  ('p-020', 'IndiaMART', 'https://dir.indiamart.com/search.mp?ss=car+vacuum+12v', 450)
) AS v(pid, nm, u, pr)
WHERE NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.product_id = v.pid AND s.name = v.nm);

INSERT INTO product_content (product_id, reel_hook, demo_idea, caption, hashtags) VALUES
  ('p-007', 'This strip turned my room into a studio', 'Unroll strip, stick under desk edge, color sweep on remote, slow pan', 'RGB mood in one strip. Link in bio.', ARRAY['#ledstrip', '#roomsetup', '#contentcreator', '#aestheticroom']),
  ('p-008', 'POV: cold water 8 hours later', 'Fill bottle, time-lapse thermo, pour steam-free', '1L that actually stays cold. Commute proof.', ARRAY['#waterbottle', '#gymessentials', '#hydration', '#gifting']),
  ('p-009', 'Riders, stop balancing phone on the tank', 'Mount wobble test on rough road, map stays still', 'Dash mount that survives Indian roads.', ARRAY['#carmount', '#delivery', '#biker', '#gripstrong']),
  ('p-010', 'Aunty tiffin, but make it office-core', 'Open three boxes, steam still rising, no leaks', 'Three meals, one stack. No spill.', ARRAY['#lunchbox', '#officehacks', '#tiffin', '#homefood']),
  ('p-011', '8 hour screen sesh, zero red eyes', 'Side-by-side: raw screen vs with glasses, timer running', 'Blue light off, focus on. Link in bio.', ARRAY['#wfh', '#eyecare', '#bluelight', '#desksetup']),
  ('p-012', 'Crease-free shirt in 30 seconds', 'Spray, steam pass, before/after sleeve close-up', 'Handheld steamer for last-minute shots.', ARRAY['#steamer', '#reelsfashion', '#outfit', '#grooming']),
  ('p-013', 'Bass for under a grand — serious?', 'Buds case snap open, head bob sync test', 'TWS with battery bar that lasts.', ARRAY['#tws', '#earbuds', '#music', '#commute']),
  ('p-014', 'The scalp massage you did not know you needed', 'Slow circles, foam, rinse — ASMR', 'Scalp care that feels expensive.', ARRAY['#selfcare', '#haircare', '#shampoo', '#asmr']),
  ('p-015', 'Never pay extra baggage again', 'Hook to luggage handle, beep to green, weight overlay', 'Weigh first, pack smarter.', ARRAY['#travel', '#packing', '#luggage', '#airporttips']),
  ('p-016', 'This ring light is why my face is even', 'Face half lit vs full ring, skin tone on phone', '10 inch ring, creator staple.', ARRAY['#ringlight', '#creator', '#reels', '#lightingtips']),
  ('p-017', 'Aloe in summer hits different', 'Pump, rub, sun-exposed skin calm timelapse', '300g pump, skin SOS.', ARRAY['#aloe', '#skincare', '#summerhacks', '#glowup']),
  ('p-018', 'Ditch the cling film', 'Bowl, stretch lid, flip test', 'Reusable stretch lids, zero single-use drama.', ARRAY['#kitchenhacks', '#sustainable', '#foodstorage', '#nofoodwaste']),
  ('p-019', 'ANC on, world off', 'Street noise on mic off then on, cup ears', 'Over-ear ANC for focus blocks.', ARRAY['#headphones', '#anc', '#wfh', '#audio']),
  ('p-020', 'Car floor chips vanish in 20 seconds', 'Crumb confetti, vacuum pass, before/after mat', '12V car vacuum, satisfying cleanup.', ARRAY['#car', '#interior', '#cleaninghacks', '#roadtrip'])
ON CONFLICT (product_id) DO UPDATE SET
  reel_hook = EXCLUDED.reel_hook,
  demo_idea = EXCLUDED.demo_idea,
  caption = EXCLUDED.caption,
  hashtags = EXCLUDED.hashtags;

-- Extra pipeline keywords (skip if the same term already exists)
INSERT INTO trend_keywords (keyword, search_volume, trend_score)
SELECT v.kw, v.svol, v.tsc
FROM (VALUES
  ('led strip', 8200, 80),
  ('tws earbuds', 22000, 86),
  ('ring light', 18000, 85),
  ('blue light glasses', 15000, 78),
  ('car phone mount', 11000, 75),
  ('garment steamer', 6000, 72),
  ('luggage scale', 4500, 70),
  ('aloe vera gel', 9000, 68),
  ('silicone lids', 3600, 70),
  ('car vacuum', 7000, 74)
) AS v(kw, svol, tsc)
WHERE NOT EXISTS (SELECT 1 FROM trend_keywords t WHERE lower(t.keyword) = lower(v.kw));

-- Overwrite per-city local ranks for all 20 products (4 cities, rotated #1 per city)
WITH top_products AS (
  SELECT id, row_number() OVER (ORDER BY id) - 1 AS ord0
  FROM (SELECT id FROM products WHERE id ~ '^p-[0-9]{3}$' ORDER BY id LIMIT 20) s
),
city_off AS (
  SELECT id,
    CASE slug
      WHEN 'mumbai' THEN 0
      WHEN 'delhi' THEN 5
      WHEN 'bengaluru' THEN 10
      WHEN 'hyderabad' THEN 15
    END AS off
  FROM cities
  WHERE slug IN ('mumbai', 'delhi', 'bengaluru', 'hyderabad')
),
ranked AS (
  SELECT
    co.id AS city_id,
    tp.id AS product_id,
    gs.rnk::int,
    GREATEST(55, 100 - gs.rnk::int) AS local_trend_score
  FROM city_off co
  CROSS JOIN generate_series(1, 20) AS gs(rnk)
  INNER JOIN top_products tp ON tp.ord0 = ((gs.rnk - 1 + co.off) % 20)
)
INSERT INTO product_city_trend (product_id, city_id, local_trend_score, local_rank)
SELECT product_id, city_id, local_trend_score, rnk
FROM ranked
ON CONFLICT (product_id, city_id) DO UPDATE SET
  local_trend_score = EXCLUDED.local_trend_score,
  local_rank = EXCLUDED.local_rank;

COMMIT;