-- Migration: add "expired" as an order status (a no-show pickup).
-- It only changes the CHECK rule; existing rows and data are kept.
-- Run with:
--   psql -h localhost -U hamad -d bakery_db -f src/db/migrations/002_add_expired_order_status.sql

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'confirmed', 'picked_up', 'cancelled', 'expired'));
