-- Preloved marketplace schema (MVP). Idempotent — safe to re-run.

CREATE TABLE IF NOT EXISTS items (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  price        NUMERIC(12, 2) NOT NULL,
  category     TEXT NOT NULL,
  condition    TEXT NOT NULL,
  size         TEXT,
  color        TEXT,
  material     TEXT,
  seller_id    TEXT NOT NULL DEFAULT 'seller_akbar',
  is_sold      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS item_images (
  id             SERIAL PRIMARY KEY,
  item_id        INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  url            TEXT NOT NULL,
  alt            TEXT NOT NULL DEFAULT '',
  display_order  INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_created_at ON items (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_category ON items (category);
CREATE INDEX IF NOT EXISTS idx_items_condition ON items (condition);
CREATE INDEX IF NOT EXISTS idx_item_images_item_id ON item_images (item_id, display_order);
