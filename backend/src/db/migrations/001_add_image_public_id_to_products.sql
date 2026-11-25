-- Migration: add image_public_id to products (keeps existing data).
-- Run with:
--   psql -h localhost -U hamad -d bakery_db -f src/db/migrations/001_add_image_public_id_to_products.sql

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_public_id TEXT;
