-- Dummy data for Resell Radar
-- Run after schema.sql:
--   psql "your-connection-string" -f db/seed.sql

BEGIN;

TRUNCATE trend_keywords RESTART IDENTITY;
TRUNCATE products RESTART IDENTITY CASCADE;

INSERT INTO products (id, name, category, description, image_url, cost_price, selling_price, profit_margin, trend_score, demand_score, competition_level, target_audience, created_at) VALUES
  ('p-001', 'LED Galaxy Star Projector', 'Home Decor', 'Bestselling room ambience projector with bluetooth speaker. High-perceived value, low cost - perfect for reels.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', 350, 999, 65, 92, 88, 'medium', 'Gen-Z, students, couples decorating bedrooms', '2024-12-15T10:00:00Z'),
  ('p-002', 'Mini Portable Sealing Machine', 'Kitchen', 'Handheld bag sealer for snacks. Practical, demo-friendly, and a viral-proven category.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 120, 399, 70, 81, 76, 'high', 'Homemakers, hostel students, food storage seekers', '2024-12-16T10:00:00Z'),
  ('p-003', 'Magnetic Wireless Charger Stand', 'Tech Accessories', 'MagSafe-style charger stand. Premium look at low cost. High repeat-purchase category.', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800', 280, 799, 64, 87, 90, 'medium', 'iPhone users, work-from-home professionals', '2024-12-16T10:00:00Z'),
  ('p-004', 'Posture Corrector Belt', 'Health & Wellness', 'Adjustable posture corrector. Strong demand from desk workers. Demo-driven sales.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 180, 599, 70, 74, 82, 'high', 'Office workers, students, gym beginners', '2024-12-16T10:00:00Z'),
  ('p-005', 'Self-Stirring Coffee Mug', 'Kitchen', 'Battery-operated stirring mug. Highly visual, perfect for short demo reels.', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800', 220, 699, 68, 79, 71, 'medium', 'Coffee lovers, gifting buyers, gadget enthusiasts', '2024-12-16T10:00:00Z'),
  ('p-006', 'Foldable Travel Neck Pillow', 'Travel', 'Memory foam travel pillow that folds into a small pouch. Steady year-round demand.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', 160, 549, 71, 68, 72, 'low', 'Travelers, IT professionals, bus/train commuters', '2024-12-16T10:00:00Z');

INSERT INTO suppliers (product_id, name, url, price) VALUES
  ('p-001', 'Meesho', 'https://www.meesho.com/search?q=galaxy+projector', 380),
  ('p-001', 'IndiaMART', 'https://dir.indiamart.com/search.mp?ss=galaxy+projector', 320),
  ('p-001', 'Alibaba', 'https://www.alibaba.com/trade/search?SearchText=galaxy+projector', 280),
  ('p-002', 'Meesho', 'https://www.meesho.com/search?q=mini+sealer', 150),
  ('p-002', 'IndiaMART', 'https://dir.indiamart.com/search.mp?ss=mini+bag+sealer', 110),
  ('p-003', 'IndiaMART', 'https://dir.indiamart.com/search.mp?ss=magsafe+charger+stand', 260),
  ('p-003', 'Alibaba', 'https://www.alibaba.com/trade/search?SearchText=magsafe+stand', 220),
  ('p-004', 'Meesho', 'https://www.meesho.com/search?q=posture+corrector', 200),
  ('p-004', 'IndiaMART', 'https://dir.indiamart.com/search.mp?ss=posture+corrector+belt', 170),
  ('p-005', 'Meesho', 'https://www.meesho.com/search?q=self+stirring+mug', 240),
  ('p-005', 'Alibaba', 'https://www.alibaba.com/trade/search?SearchText=self+stirring+mug', 180),
  ('p-006', 'Meesho', 'https://www.meesho.com/search?q=neck+pillow+travel', 180),
  ('p-006', 'IndiaMART', 'https://dir.indiamart.com/search.mp?ss=foldable+neck+pillow', 150);

INSERT INTO product_content (product_id, reel_hook, demo_idea, caption, hashtags) VALUES
  ('p-001', 'POV: Your room turned into a galaxy in 10 seconds', 'Lights off - flick projector on - slow pan across ceiling stars - reveal price', 'Turn any room into a vibe in 10 seconds. Link in bio. Limited stock.', ARRAY['#roomdecor', '#aestheticroom', '#bedroomvibes', '#galaxyprojector', '#indianreseller']),
  ('p-002', 'Stop using clips - this seals chips bags in 2 seconds', 'Open chips bag - seal with one stroke - turn upside down - nothing falls out', 'Snacks. Sealed. Forever fresh. Link in bio.', ARRAY['#kitchenhacks', '#kitchengadgets', '#minisealer', '#homehacks']),
  ('p-003', 'Your iPhone deserves better than that ugly cable', 'Cluttered desk - swap to magnetic stand - snap iPhone on - clean reveal', 'Your desk just got an upgrade. Magnetic. Wireless. Rs 799.', ARRAY['#deskaccessories', '#magsafe', '#wirelesscharger', '#deskvibes']),
  ('p-004', 'Wearing this for 7 days fixed my back pain', 'Slouching at desk - put on belt - instant straight posture transition', 'Bad posture? This is the cheat code. Comment YES for the link.', ARRAY['#posturecorrection', '#healthhacks', '#workfromhome', '#backpainrelief']),
  ('p-005', 'Lazy people, this mug is for you', 'Pour coffee + sugar - press button - mug stirs itself - satisfying close-up', 'Stir-free mornings. One press = smooth coffee.', ARRAY['#coffeegadgets', '#lazyhacks', '#kitchengadgets', '#giftideas']),
  ('p-006', 'Long flights but no neck pain - here is how', 'Pillow tightly folded in pouch - pull out - expand - wrap around neck', 'Travel-sized comfort. Folds smaller than your phone.', ARRAY['#travelessentials', '#travelhacks', '#flightcomfort']);

INSERT INTO trend_keywords (keyword, search_volume, trend_score) VALUES
  ('galaxy projector', 14000, 92),
  ('magnetic charger', 9800, 87),
  ('mini sealer', 7600, 81),
  ('self stirring mug', 5400, 79),
  ('posture corrector', 12300, 74);

COMMIT;
