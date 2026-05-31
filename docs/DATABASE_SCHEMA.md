# Market.uz — PostgreSQL Database Schema

## Arxitektura

```
market_uz (database)
├── auth         schema — Autentifikatsiya
├── catalog      schema — Mahsulotlar katalogi  
├── commerce     schema — Savdo (buyurtmalar, to'lovlar)
├── logistics    schema — Logistika va yetkazib berish
└── analytics    schema — Statistika va tahlil
```

---

## AUTH SCHEMA

### users
```sql
CREATE TABLE auth.users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         VARCHAR(20) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  full_name     VARCHAR(255) NOT NULL,
  avatar_url    TEXT,
  role          VARCHAR(20) NOT NULL DEFAULT 'buyer'
                CHECK (role IN ('buyer','seller','admin','logistics','moderator')),
  is_active     BOOLEAN DEFAULT true,
  is_verified   BOOLEAN DEFAULT false,
  bonus_points  INTEGER DEFAULT 0,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_phone  ON auth.users(phone);
CREATE INDEX idx_users_email  ON auth.users(email);
CREATE INDEX idx_users_role   ON auth.users(role);
```

### user_addresses
```sql
CREATE TABLE auth.user_addresses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label      VARCHAR(50) NOT NULL,          -- 'Uy', 'Ofis'
  full_name  VARCHAR(255) NOT NULL,
  phone      VARCHAR(20) NOT NULL,
  region     VARCHAR(100) NOT NULL,
  city       VARCHAR(100) NOT NULL,
  district   VARCHAR(100),
  street     VARCHAR(255) NOT NULL,
  apartment  VARCHAR(50),
  latitude   DECIMAL(9,6),
  longitude  DECIMAL(9,6),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON auth.user_addresses(user_id);
```

### otp_codes
```sql
CREATE TABLE auth.otp_codes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone      VARCHAR(20) NOT NULL,
  code       VARCHAR(6) NOT NULL,
  purpose    VARCHAR(30) NOT NULL CHECK (purpose IN ('login','register','reset')),
  attempts   INTEGER DEFAULT 0,
  is_used    BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otp_phone ON auth.otp_codes(phone, expires_at);
```

### refresh_tokens
```sql
CREATE TABLE auth.refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  device_info JSONB,
  ip_address VARCHAR(45),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## CATALOG SCHEMA

### categories
```sql
CREATE TABLE catalog.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   UUID REFERENCES catalog.categories(id),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon        VARCHAR(10),               -- emoji
  image_url   TEXT,
  color       VARCHAR(20),
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  meta_title  VARCHAR(255),
  meta_desc   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON catalog.categories(parent_id);
CREATE INDEX idx_categories_slug   ON catalog.categories(slug);
```

### sellers
```sql
CREATE TABLE catalog.sellers (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name       VARCHAR(255) UNIQUE NOT NULL,
  shop_slug       VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT,
  logo_url        TEXT,
  banner_url      TEXT,
  phone           VARCHAR(20),
  email           VARCHAR(255),
  website         TEXT,
  address         TEXT,
  inn             VARCHAR(20) UNIQUE,         -- INN raqami
  bank_account    VARCHAR(30),
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','suspended','rejected')),
  commission_rate DECIMAL(5,2) DEFAULT 8.00,  -- %
  balance         BIGINT DEFAULT 0,           -- tiyin
  rating          DECIMAL(3,2) DEFAULT 0,
  total_sales     INTEGER DEFAULT 0,
  total_revenue   BIGINT DEFAULT 0,
  is_featured     BOOLEAN DEFAULT false,
  rejection_note  TEXT,
  approved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sellers_slug   ON catalog.sellers(shop_slug);
CREATE INDEX idx_sellers_status ON catalog.sellers(status);
```

### products
```sql
CREATE TABLE catalog.products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id        UUID NOT NULL REFERENCES catalog.sellers(id),
  category_id      UUID NOT NULL REFERENCES catalog.categories(id),
  name             VARCHAR(500) NOT NULL,
  slug             VARCHAR(500) UNIQUE NOT NULL,
  description      TEXT,
  short_desc       VARCHAR(500),
  brand            VARCHAR(100),
  sku              VARCHAR(100) UNIQUE NOT NULL,
  barcode          VARCHAR(100),
  
  -- Pricing
  price            BIGINT NOT NULL,            -- tiyin
  original_price   BIGINT,                     -- chegirmadan oldingi narx
  
  -- Inventory
  stock            INTEGER NOT NULL DEFAULT 0,
  min_order_qty    INTEGER DEFAULT 1,
  max_order_qty    INTEGER DEFAULT 999,
  weight_grams     INTEGER,
  
  -- Media
  images           JSONB DEFAULT '[]',         -- [{url, alt, order}]
  video_url        TEXT,
  
  -- Status
  status           VARCHAR(20) DEFAULT 'draft'
                   CHECK (status IN ('draft','pending','active','inactive','deleted')),
  is_featured      BOOLEAN DEFAULT false,
  is_new           BOOLEAN DEFAULT false,
  is_bestseller    BOOLEAN DEFAULT false,
  
  -- SEO
  meta_title       VARCHAR(255),
  meta_description TEXT,
  tags             TEXT[],
  
  -- Stats
  view_count       INTEGER DEFAULT 0,
  sales_count      INTEGER DEFAULT 0,
  rating           DECIMAL(3,2) DEFAULT 0,
  review_count     INTEGER DEFAULT 0,
  
  -- Moderation
  moderation_note  TEXT,
  moderated_by     UUID REFERENCES auth.users(id),
  moderated_at     TIMESTAMPTZ,
  
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_seller   ON catalog.products(seller_id);
CREATE INDEX idx_products_category ON catalog.products(category_id);
CREATE INDEX idx_products_slug     ON catalog.products(slug);
CREATE INDEX idx_products_status   ON catalog.products(status);
CREATE INDEX idx_products_sku      ON catalog.products(sku);
CREATE INDEX idx_products_price    ON catalog.products(price);
CREATE INDEX idx_products_rating   ON catalog.products(rating DESC);
-- Full-text search
CREATE INDEX idx_products_search   ON catalog.products USING GIN(to_tsvector('simple', name || ' ' || COALESCE(description,'')));
```

### product_variants
```sql
CREATE TABLE catalog.product_variants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,   -- 'Rang', 'O\'lcham'
  options    JSONB NOT NULL,          -- [{value:'Qora', price_delta:0, stock:10, sku:'...'}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON catalog.product_variants(product_id);
```

### product_specifications
```sql
CREATE TABLE catalog.product_specifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  spec_key   VARCHAR(100) NOT NULL,
  spec_value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_specs_product ON catalog.product_specifications(product_id);
```

### reviews
```sql
CREATE TABLE catalog.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  order_id    UUID,                    -- tasdiqlangan xarid uchun
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  images      TEXT[],
  is_verified BOOLEAN DEFAULT false,   -- xarid tasdiqlangan
  likes_count INTEGER DEFAULT 0,
  status      VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','hidden','spam')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX idx_reviews_product ON catalog.reviews(product_id);
CREATE INDEX idx_reviews_user    ON catalog.reviews(user_id);
```

### wishlists
```sql
CREATE TABLE catalog.wishlists (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);
```

### banners
```sql
CREATE TABLE catalog.banners (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      VARCHAR(255) NOT NULL,
  subtitle   VARCHAR(500),
  image_url  TEXT NOT NULL,
  link_url   TEXT NOT NULL,
  position   VARCHAR(30) DEFAULT 'main' CHECK (position IN ('main','sidebar','category','popup')),
  sort_order INTEGER DEFAULT 0,
  starts_at  TIMESTAMPTZ,
  ends_at    TIMESTAMPTZ,
  is_active  BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## COMMERCE SCHEMA

### carts
```sql
CREATE TABLE commerce.carts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),             -- mehmon foydalanuvchi uchun
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carts_user    ON commerce.carts(user_id);
CREATE INDEX idx_carts_session ON commerce.carts(session_id);
```

### cart_items
```sql
CREATE TABLE commerce.cart_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id          UUID NOT NULL REFERENCES commerce.carts(id) ON DELETE CASCADE,
  product_id       UUID NOT NULL REFERENCES catalog.products(id),
  quantity         INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  selected_options JSONB DEFAULT '{}',  -- {rang:'Qora', olcham:'L'}
  unit_price       BIGINT NOT NULL,     -- qo'shilgan paytdagi narx
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cart_items_cart    ON commerce.cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON commerce.cart_items(product_id);
```

### orders
```sql
CREATE TABLE commerce.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     VARCHAR(30) UNIQUE NOT NULL,
  buyer_id         UUID NOT NULL REFERENCES auth.users(id),
  
  -- Pricing
  subtotal         BIGINT NOT NULL,
  discount_amount  BIGINT DEFAULT 0,
  shipping_fee     BIGINT DEFAULT 0,
  total_amount     BIGINT NOT NULL,
  
  -- Status
  status           VARCHAR(30) NOT NULL DEFAULT 'created'
                   CHECK (status IN (
                     'created','paid','preparing','at_warehouse',
                     'sorting','in_transit','at_pickup','delivered',
                     'cancelled','refunded'
                   )),
  payment_status   VARCHAR(20) DEFAULT 'pending'
                   CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_method   VARCHAR(30),         -- 'click','payme','card','cash','installment'
  payment_ref      VARCHAR(255),        -- to'lov tizimi referans ID
  
  -- Delivery
  tracking_number  VARCHAR(100) UNIQUE,
  shipping_address JSONB NOT NULL,      -- manzil snapshot
  delivery_type    VARCHAR(20) DEFAULT 'standard',
  estimated_at     TIMESTAMPTZ,
  delivered_at     TIMESTAMPTZ,
  
  -- Coupon
  coupon_id        UUID,
  coupon_code      VARCHAR(50),
  
  -- Notes
  buyer_note       TEXT,
  admin_note       TEXT,
  cancel_reason    TEXT,
  
  -- Tracking
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_buyer      ON commerce.orders(buyer_id);
CREATE INDEX idx_orders_number     ON commerce.orders(order_number);
CREATE INDEX idx_orders_status     ON commerce.orders(status);
CREATE INDEX idx_orders_tracking   ON commerce.orders(tracking_number);
CREATE INDEX idx_orders_created    ON commerce.orders(created_at DESC);
```

### order_items
```sql
CREATE TABLE commerce.order_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID NOT NULL REFERENCES commerce.orders(id) ON DELETE CASCADE,
  product_id       UUID NOT NULL REFERENCES catalog.products(id),
  seller_id        UUID NOT NULL REFERENCES catalog.sellers(id),
  product_snapshot JSONB NOT NULL,      -- mahsulot ma'lumotlari snapshot
  quantity         INTEGER NOT NULL CHECK (quantity > 0),
  unit_price       BIGINT NOT NULL,
  total_price      BIGINT NOT NULL,
  commission_rate  DECIMAL(5,2) NOT NULL,
  commission_amount BIGINT NOT NULL,
  seller_amount    BIGINT NOT NULL,     -- total - commission
  status           VARCHAR(30) DEFAULT 'pending',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order  ON commerce.order_items(order_id);
CREATE INDEX idx_order_items_seller ON commerce.order_items(seller_id);
```

### order_status_history
```sql
CREATE TABLE commerce.order_status_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES commerce.orders(id) ON DELETE CASCADE,
  status     VARCHAR(30) NOT NULL,
  note       TEXT,
  changed_by UUID REFERENCES auth.users(id),
  location   JSONB,                     -- {lat, lng, address}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_status_history_order ON commerce.order_status_history(order_id);
```

### payments
```sql
CREATE TABLE commerce.payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES commerce.orders(id),
  amount         BIGINT NOT NULL,
  method         VARCHAR(30) NOT NULL,
  provider_ref   VARCHAR(255),           -- Click/Payme transaction ID
  provider_data  JSONB,
  status         VARCHAR(20) DEFAULT 'pending'
                 CHECK (status IN ('pending','completed','failed','refunded')),
  processed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_order  ON commerce.payments(order_id);
CREATE INDEX idx_payments_status ON commerce.payments(status);
```

### coupons
```sql
CREATE TABLE commerce.coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50) UNIQUE NOT NULL,
  description     TEXT,
  discount_type   VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value  INTEGER NOT NULL,
  min_order_amount BIGINT DEFAULT 0,
  max_discount    BIGINT,
  max_uses        INTEGER,
  used_count      INTEGER DEFAULT 0,
  user_max_uses   INTEGER DEFAULT 1,
  applicable_to   VARCHAR(20) DEFAULT 'all' CHECK (applicable_to IN ('all','category','product','seller')),
  applicable_ids  UUID[],
  starts_at       TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON commerce.coupons(code);
```

### seller_payouts
```sql
CREATE TABLE commerce.seller_payouts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id    UUID NOT NULL REFERENCES catalog.sellers(id),
  amount       BIGINT NOT NULL,
  period_from  DATE NOT NULL,
  period_to    DATE NOT NULL,
  status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  bank_account VARCHAR(30),
  reference    VARCHAR(100),
  note         TEXT,
  processed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payouts_seller ON commerce.seller_payouts(seller_id);
```

---

## LOGISTICS SCHEMA

### warehouses
```sql
CREATE TABLE logistics.warehouses (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      VARCHAR(255) NOT NULL,
  code      VARCHAR(20) UNIQUE NOT NULL,
  address   TEXT NOT NULL,
  city      VARCHAR(100) NOT NULL,
  latitude  DECIMAL(9,6),
  longitude DECIMAL(9,6),
  capacity  INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true
);
```

### shipments
```sql
CREATE TABLE logistics.shipments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES commerce.orders(id),
  tracking_code  VARCHAR(100) UNIQUE NOT NULL,
  warehouse_id   UUID REFERENCES logistics.warehouses(id),
  courier_id     UUID REFERENCES auth.users(id),
  status         VARCHAR(30) NOT NULL DEFAULT 'pending',
  pickup_address JSONB,
  delivery_address JSONB NOT NULL,
  weight_grams   INTEGER,
  dimensions     JSONB,                   -- {l, w, h}
  barcode_data   TEXT,
  scanned_at     TIMESTAMPTZ,
  dispatched_at  TIMESTAMPTZ,
  delivered_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shipments_order    ON logistics.shipments(order_id);
CREATE INDEX idx_shipments_tracking ON logistics.shipments(tracking_code);
CREATE INDEX idx_shipments_courier  ON logistics.shipments(courier_id);
```

### scan_logs
```sql
CREATE TABLE logistics.scan_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES logistics.shipments(id),
  scanned_by  UUID NOT NULL REFERENCES auth.users(id),
  warehouse_id UUID REFERENCES logistics.warehouses(id),
  zone        VARCHAR(20),
  action      VARCHAR(30) NOT NULL,        -- 'received','sorted','dispatched'
  location    JSONB,
  notes       TEXT,
  scanned_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scan_logs_shipment  ON logistics.scan_logs(shipment_id);
CREATE INDEX idx_scan_logs_warehouse ON logistics.scan_logs(warehouse_id);
CREATE INDEX idx_scan_logs_time      ON logistics.scan_logs(scanned_at DESC);
```

### pickup_points
```sql
CREATE TABLE logistics.pickup_points (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  address    TEXT NOT NULL,
  city       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20),
  schedule   JSONB,                        -- ish vaqti
  latitude   DECIMAL(9,6),
  longitude  DECIMAL(9,6),
  is_active  BOOLEAN DEFAULT true
);
```

---

## ANALYTICS SCHEMA

### product_views
```sql
CREATE TABLE analytics.product_views (
  id         BIGSERIAL PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users(id),
  session_id VARCHAR(255),
  source     VARCHAR(50),                  -- 'search','category','home','direct'
  device     VARCHAR(20),                  -- 'mobile','desktop','tablet'
  viewed_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_views_product ON analytics.product_views(product_id, viewed_at DESC);
CREATE INDEX idx_views_user    ON analytics.product_views(user_id);
```

### search_queries
```sql
CREATE TABLE analytics.search_queries (
  id          BIGSERIAL PRIMARY KEY,
  query       VARCHAR(500) NOT NULL,
  user_id     UUID REFERENCES auth.users(id),
  results_count INTEGER DEFAULT 0,
  clicked_id  UUID,
  device      VARCHAR(20),
  searched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_query ON analytics.search_queries(query, searched_at DESC);
```

### daily_stats
```sql
CREATE TABLE analytics.daily_stats (
  date          DATE PRIMARY KEY,
  total_orders  INTEGER DEFAULT 0,
  total_revenue BIGINT DEFAULT 0,
  total_users   INTEGER DEFAULT 0,
  new_users     INTEGER DEFAULT 0,
  new_sellers   INTEGER DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  avg_order_value BIGINT DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0
);
```

---

## TRIGGERS & FUNCTIONS

```sql
-- updated_at auto-update trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON catalog.products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON commerce.orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Order number generator
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
  SELECT 'ORD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('commerce.order_seq')::TEXT, 6, '0');
$$ LANGUAGE sql;

CREATE SEQUENCE commerce.order_seq START 1000;

-- Update product rating when review added
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE catalog.products SET
    rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM catalog.reviews WHERE product_id = NEW.product_id AND status = 'active'),
    review_count = (SELECT COUNT(*) FROM catalog.reviews WHERE product_id = NEW.product_id AND status = 'active')
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON catalog.reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Update seller stats after order delivery
CREATE OR REPLACE FUNCTION update_seller_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    UPDATE catalog.sellers SET
      total_sales = total_sales + 1,
      total_revenue = total_revenue + NEW.seller_amount
    WHERE id = NEW.seller_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_seller_stats
  AFTER UPDATE ON commerce.order_items
  FOR EACH ROW EXECUTE FUNCTION update_seller_stats();
```

---

## ER DIAGRAM (soddalashtirilgan)

```
auth.users
    ├── auth.user_addresses (1:N)
    ├── auth.refresh_tokens (1:N)
    ├── catalog.sellers (1:1)
    │       ├── catalog.products (1:N)
    │       │       ├── catalog.product_variants (1:N)
    │       │       ├── catalog.product_specifications (1:N)
    │       │       ├── catalog.reviews (1:N)
    │       │       └── analytics.product_views (1:N)
    │       └── commerce.seller_payouts (1:N)
    ├── commerce.carts (1:1)
    │       └── commerce.cart_items (1:N)
    ├── commerce.orders (1:N)
    │       ├── commerce.order_items (1:N)
    │       ├── commerce.order_status_history (1:N)
    │       ├── commerce.payments (1:N)
    │       └── logistics.shipments (1:1)
    │               └── logistics.scan_logs (1:N)
    └── catalog.wishlists (1:N)
```

---

## INDEKSLAR VA PERFORMANCE

```sql
-- Partial indexes (tez-tez ishlatiladigan filterlar uchun)
CREATE INDEX idx_products_active ON catalog.products(category_id, price)
  WHERE status = 'active';

CREATE INDEX idx_orders_pending ON commerce.orders(created_at DESC)
  WHERE status NOT IN ('delivered', 'cancelled', 'refunded');

CREATE INDEX idx_sellers_approved ON catalog.sellers(rating DESC)
  WHERE status = 'approved';

-- Composite indexes
CREATE INDEX idx_products_category_price ON catalog.products(category_id, price ASC) WHERE status = 'active';
CREATE INDEX idx_products_seller_status  ON catalog.products(seller_id, status);
CREATE INDEX idx_orders_buyer_status     ON commerce.orders(buyer_id, status, created_at DESC);
```

---

## MA'LUMOTLAR HAJMI (taxminiy)

| Jadval | 1 yilda | Indeks hajmi |
|--------|---------|--------------|
| users | 500K rows | ~80MB |
| products | 200K rows | ~120MB |
| orders | 2M rows | ~400MB |
| order_items | 8M rows | ~1.2GB |
| product_views | 50M rows | ~8GB (partitioned) |
| search_queries | 20M rows | ~3GB |

> **Eslatma:** `analytics.product_views` va `analytics.search_queries` jadvallarini oylik partition qilish tavsiya etiladi.
