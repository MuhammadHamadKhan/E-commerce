-- ============================================================
-- bakery_db schema
-- Run with: psql -U hamad -d bakery_db -f db/schema.sql
-- WARNING: this drops existing tables so it can be re-run while developing.
-- ============================================================

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS bakeries CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS check_listing_discount() CASCADE;

-- ------------------------------------------------------------
-- users: bakery owners, plus customers who choose to register.
-- Guests do NOT need a row here; their details go into orders.
-- ------------------------------------------------------------
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,      -- one account per email
  password_hash TEXT NOT NULL,                     -- store only a hash, never the password
  phone         VARCHAR(20) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'customer'
                CHECK (role IN ('customer', 'bakery_owner')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- bakeries: each bakery belongs to exactly one owner.
-- ------------------------------------------------------------
CREATE TABLE bakeries (
  id         SERIAL PRIMARY KEY,
  owner_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(150) NOT NULL,
  address    VARCHAR(255) NOT NULL,
  city       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bakeries_owner_id ON bakeries (owner_id);

-- ------------------------------------------------------------
-- products: the bakery's regular menu items.
-- ------------------------------------------------------------
CREATE TABLE products (
  id             SERIAL PRIMARY KEY,
  bakery_id      INT NOT NULL REFERENCES bakeries(id) ON DELETE CASCADE,
  name           VARCHAR(150) NOT NULL,
  description    TEXT,
  image_url      TEXT,
  image_public_id TEXT,                                          -- Cloudinary id, used to delete the image later
  original_price NUMERIC(10,2) NOT NULL CHECK (original_price > 0),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_bakery_id ON products (bakery_id);

-- ------------------------------------------------------------
-- listings: today's discounted offer for a product.
-- ------------------------------------------------------------
CREATE TABLE listings (
  id               SERIAL PRIMARY KEY,
  product_id       INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  discounted_price NUMERIC(10,2) NOT NULL CHECK (discounted_price > 0),
  quantity_left    INT NOT NULL CHECK (quantity_left >= 0),  -- never negative
  available_from   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at       TIMESTAMPTZ NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (expires_at > available_from)                        -- end must be after start
);

-- Searched constantly for "still available?" queries, plus product lookups.
CREATE INDEX idx_listings_expires_at ON listings (expires_at);
CREATE INDEX idx_listings_product_id ON listings (product_id);

-- A CHECK constraint cannot read another table, so a trigger compares
-- each listing's price with its product's original price.
CREATE OR REPLACE FUNCTION check_listing_discount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.discounted_price >= (SELECT original_price FROM products WHERE id = NEW.product_id) THEN
    RAISE EXCEPTION 'discounted_price (%) must be lower than the product original_price', NEW.discounted_price;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_listings_discount_check
BEFORE INSERT OR UPDATE OF discounted_price, product_id ON listings
FOR EACH ROW EXECUTE FUNCTION check_listing_discount();

-- ------------------------------------------------------------
-- orders: one pickup order. user_id is NULL for guest orders.
-- ------------------------------------------------------------
CREATE TABLE orders (
  id             SERIAL PRIMARY KEY,
  user_id        INT REFERENCES users(id) ON DELETE SET NULL,  -- keep the order if the account is deleted
  customer_name  VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),                                 -- optional, especially for guests
  pickup_code    VARCHAR(12) NOT NULL,
  total_price    NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
  status         VARCHAR(20) NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'picked_up', 'cancelled', 'expired')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique index does two jobs: no duplicate pickup codes + fast lookups by code.
CREATE UNIQUE INDEX idx_orders_pickup_code ON orders (pickup_code);
CREATE INDEX idx_orders_user_id ON orders (user_id);            -- "my orders" page

-- ------------------------------------------------------------
-- order_items: the lines of an order. Price is copied here so later
-- price changes do not rewrite old orders.
-- ------------------------------------------------------------
CREATE TABLE order_items (
  id                SERIAL PRIMARY KEY,
  order_id          INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id        INT NOT NULL REFERENCES listings(id) ON DELETE RESTRICT, -- protect sales history
  quantity          INT NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10,2) NOT NULL CHECK (price_at_purchase > 0),
  UNIQUE (order_id, listing_id)                                -- same listing once per order
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_listing_id ON order_items (listing_id);
