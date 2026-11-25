-- ============================================================
-- Practice queries
-- Run with: psql -U hamad -d bakery_db -f db/queries.sql
-- ============================================================

-- 1) All active listings with bakery name and discount percentage.
--    Active = already available, not expired, and stock left.
SELECT
  l.id                AS listing_id,
  b.name              AS bakery,
  p.name              AS product,
  p.original_price,
  l.discounted_price,
  ROUND((p.original_price - l.discounted_price) / p.original_price * 100, 1) AS discount_percent,
  l.quantity_left,
  l.expires_at
FROM listings l
JOIN products p ON p.id = l.product_id
JOIN bakeries b ON b.id = p.bakery_id
WHERE l.available_from <= NOW()
  AND l.expires_at > NOW()
  AND l.quantity_left > 0
ORDER BY discount_percent DESC;

-- 2) All products of one bakery (Sunrise Bakery = id 1).
SELECT id, name, description, original_price
FROM products
WHERE bakery_id = 1
ORDER BY name;

-- 3) Find an order and all of its items using the pickup code.
SELECT
  o.id,
  o.pickup_code,
  o.customer_name,
  o.status,
  o.total_price,
  p.name                                  AS product,
  b.name                                  AS bakery,
  oi.quantity,
  oi.price_at_purchase,
  oi.quantity * oi.price_at_purchase      AS line_total
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN listings l     ON l.id = oi.listing_id
JOIN products p     ON p.id = l.product_id
JOIN bakeries b     ON b.id = p.bakery_id
WHERE o.pickup_code = 'A1B2C3';

-- 4) Total sales per bakery.
--    Cancelled orders are ignored; change the filter to
--    o.status = 'picked_up' if you only want completed pickups.
WITH sales AS (
  SELECT
    p.bakery_id,
    oi.quantity * oi.price_at_purchase AS line_total
  FROM order_items oi
  JOIN orders o   ON o.id = oi.order_id AND o.status <> 'cancelled'
  JOIN listings l ON l.id = oi.listing_id
  JOIN products p ON p.id = l.product_id
)
SELECT
  b.id,
  b.name,
  COALESCE(SUM(s.line_total), 0) AS total_sales
FROM bakeries b
LEFT JOIN sales s ON s.bakery_id = b.id   -- LEFT JOIN keeps bakeries with 0 sales
GROUP BY b.id, b.name
ORDER BY total_sales DESC;
