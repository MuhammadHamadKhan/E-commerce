-- ============================================================
-- Authentic sample data for Last Bite (Peshawar, Pakistan).
-- Run with:
--   PGPASSWORD=hamadkhan psql -U hamad -h localhost -d bakery_db -f backend/src/db/seed.sql
--
-- WARNING: TRUNCATE deletes ALL existing orders, listings, products,
-- bakeries, and user rows, restarting IDs at 1.
-- ============================================================

TRUNCATE order_items, orders, listings, products, bakeries, users
RESTART IDENTITY CASCADE;

-- 4 Peshawar bakery owners + 2 registered customers.
INSERT INTO users (name, email, password_hash, phone, role) VALUES
  ('Tariq Jan',      'tariq@jansdeli.pk',    '$2b$10$XXXXXXXXXXXXXXXXXXXXXXYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', '0300-5841234', 'bakery_owner'),
  ('Arshad Shiraz', 'shiraz@shirazbakers.pk','$2b$10$XXXXXXXXXXXXXXXXXXXXXXYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', '0333-9123456', 'bakery_owner'),
  ('Kamran Wadud',  'kamran@wadudsons.pk',   '$2b$10$XXXXXXXXXXXXXXXXXXXXXXYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', '0345-9876543', 'bakery_owner'),
  ('Hassan Rahat',  'hassan@rahatbakery.pk', '$2b$10$XXXXXXXXXXXXXXXXXXXXXXYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', '0312-5556789', 'bakery_owner'),
  ('Amina Afridi',  'amina.afridi@gmail.com','$2b$10$XXXXXXXXXXXXXXXXXXXXXXYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', '0301-4445556', 'customer'),
  ('Bilal Shinwari', 'bilal.shinwari@live.com','$2b$10$XXXXXXXXXXXXXXXXXXXXXXYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY','0332-7778889', 'customer');

-- Bakeries located across prime Peshawar neighborhoods
INSERT INTO bakeries (owner_id, name, address, city, phone) VALUES
  (1, 'Jan''s Deli & Bakery', 'Old Jamrud Road, University Town', 'Peshawar', '091-5841234'),
  (2, 'Shiraz Bakers',        'Saddar Road, Cantt',               'Peshawar', '091-5275678'),
  (3, 'Wadud Sons Bakers',    'Phase 3 Commercial, Hayatabad',    'Peshawar', '091-5819012'),
  (4, 'Rahat Bakery & Sweets','Warsak Road',                      'Peshawar', '091-5203456');

-- Authentic local products with realistic PKR prices & high quality photos
INSERT INTO products (bakery_id, name, description, image_url, original_price) VALUES
  -- Jan's Deli (University Town)
  (1, 'Artisan Sourdough Batard',
      'Slow-fermented country sourdough loaf with crisp blistered crust and open chewy crumb.',
      'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
      650.00),
  (1, 'Butter Croissants (Box of 3)',
      'Golden flaky layered French croissants baked fresh every morning with pure grass-fed butter.',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      780.00),
  (1, 'Belgian Chocolate Fudge Cake Slice',
      'Decadent moist dark chocolate sponge layered with thick velvety Belgian ganache.',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      550.00),

  -- Shiraz Bakers (Saddar Cantt)
  (2, 'Fresh Spiced Chicken Patties (Box of 4)',
      'Flaky buttery puff pastry filled with tender spiced shredded chicken breast.',
      'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=800&q=80',
      640.00),
  (2, 'Crispy Cream Horn Rolls (Pack of 4)',
      'Traditional crisp puff pastry horns filled with light vanilla confectioners chantilly cream.',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      480.00),
  (2, 'Almond Butter Tea Biscuits (350g)',
      'Melt-in-your-mouth tea cookies packed with toasted almond slivers.',
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      580.00),

  -- Wadud Sons (Hayatabad)
  (3, 'Dates & Walnut Country Loaf',
      'Whole wheat rustic hearth bread enriched with sweet Sindhi dates and Swat mountain walnuts.',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
      620.00),
  (3, 'Royal Cardamom Naan Khatai (500g)',
      'Authentic crumbly desi-ghee shortbread cookies scented with green cardamom and saffron.',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
      720.00),
  (3, 'Brioche Bun Kabab Buns (Pack of 6)',
      'Feather-light golden sesame-crusted buns baked fresh for hearty evening sliders.',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      380.00),

  -- Rahat Bakery (Warsak Road)
  (4, 'Crispy Golden Jalebi (500g)',
      'Hot spun saffron-infused spiral sweets, crispy outside with warm fragrant syrup inside.',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      520.00),
  (4, 'Pistachio Honey Baklava (250g)',
      'Flaky golden layers filled with crushed green pistachios and drenched in natural wild honey.',
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
      890.00),
  (4, 'Evening Baker''s Surprise Bag',
      'A mystery assortment of 3 to 4 fresh surplus bakery treats from today''s afternoon bake.',
      NULL,
      750.00);

-- 12 listings: 10 active deals (with varied stock & expiries), 1 sold out, 1 expired
INSERT INTO listings (product_id, discounted_price, quantity_left, available_from, expires_at) VALUES
  (1,  350.00, 4, NOW() - INTERVAL '2 hours', NOW() + INTERVAL '2 hours 15 minutes'), -- active highlight
  (2,  390.00, 3, NOW() - INTERVAL '1 hour',  NOW() + INTERVAL '1 hour 45 minutes'),  -- active
  (3,  280.00, 5, NOW() - INTERVAL '3 hours', NOW() + INTERVAL '3 hours 30 minutes'),  -- active
  (4,  340.00, 2, NOW() - INTERVAL '4 hours', NOW() + INTERVAL '45 minutes'),         -- active, URGENT (< 1h)
  (5,  240.00, 6, NOW() - INTERVAL '1 hour',  NOW() + INTERVAL '2 hours 30 minutes'),  -- active
  (6,  290.00, 8, NOW() - INTERVAL '2 hours', NOW() + INTERVAL '4 hours'),            -- active
  (7,  320.00, 3, NOW() - INTERVAL '2 hours', NOW() + INTERVAL '3 hours 15 minutes'),  -- active
  (8,  380.00, 5, NOW() - INTERVAL '3 hours', NOW() + INTERVAL '2 hours'),            -- active
  (9,  190.00, 7, NOW() - INTERVAL '1 hour',  NOW() + INTERVAL '5 hours'),            -- active
  (10, 260.00, 4, NOW() - INTERVAL '2 hours', NOW() + INTERVAL '1 hour 20 minutes'),  -- active
  (11, 450.00, 2, NOW() - INTERVAL '4 hours', NOW() + INTERVAL '50 minutes'),         -- active, URGENT (< 1h)
  (12, 360.00, 4, NOW() - INTERVAL '1 hour',  NOW() + INTERVAL '3 hours');           -- active, null image test

-- Sample orders showing community pickup activity
INSERT INTO orders (user_id, customer_name, customer_phone, customer_email, pickup_code, total_price, status) VALUES
  (NULL, 'Zubair Khattak', '0313-9098765', 'zubair@example.com', 'PK-721', 690.00, 'pending'),
  (5,    'Amina Afridi',   '0301-4445556', 'amina.afridi@gmail.com', 'PK-482', 630.00, 'confirmed'),
  (6,    'Bilal Shinwari', '0332-7778889', 'bilal.shinwari@live.com', 'PK-195', 520.00, 'picked_up');

-- Order items
INSERT INTO order_items (order_id, listing_id, quantity, price_at_purchase) VALUES
  (1, 1, 1, 350.00),
  (1, 4, 1, 340.00),
  (2, 2, 1, 390.00),
  (2, 5, 1, 240.00),
  (3, 10, 2, 260.00);
