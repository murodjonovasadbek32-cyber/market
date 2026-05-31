# Market.uz — REST API Documentation

## Base URL
```
Production:  https://api.market.uz/v1
Staging:     https://api-staging.market.uz/v1
Development: http://localhost:3001/v1
```

## Authentication
```http
Authorization: Bearer <access_token>
```

JWT Access Token — 15 daqiqa  
Refresh Token (HttpOnly Cookie) — 30 kun

---

## AUTH ENDPOINTS

### POST /auth/send-otp
Telefon raqamga OTP yuborish

**Request:**
```json
{ "phone": "+998901234567", "purpose": "login" }
```
**Response 200:**
```json
{ "success": true, "expires_in": 120, "message": "OTP yuborildi" }
```

---

### POST /auth/verify-otp
OTP ni tekshirish va token olish

**Request:**
```json
{ "phone": "+998901234567", "code": "123456" }
```
**Response 200:**
```json
{
  "access_token": "eyJ...",
  "user": {
    "id": "uuid",
    "full_name": "Jasur Toshmatov",
    "phone": "+998901234567",
    "role": "buyer",
    "bonus_points": 1250,
    "avatar_url": null
  }
}
```

---

### POST /auth/refresh
Access token yangilash

**Response 200:**
```json
{ "access_token": "eyJ..." }
```

---

### POST /auth/logout
```json
{ "success": true }
```

---

## CATALOG ENDPOINTS

### GET /categories
```
Query: parent_id?, include_children?=true
```
**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Elektronika",
      "slug": "elektronika",
      "icon": "💻",
      "color": "#6366f1",
      "product_count": 15420,
      "children": [...]
    }
  ]
}
```

---

### GET /products
```
Query params:
  q           — qidiruv so'zi
  category    — kategoriya slug
  seller_id   — seller UUID
  min_price   — minimal narx (tiyin)
  max_price   — maksimal narx (tiyin)
  rating      — minimal reyting (1-5)
  in_stock    — faqat mavjudlar (true/false)
  on_sale     — faqat chegirmalillar (true/false)
  sort        — relevance|price_asc|price_desc|rating|newest|bestseller
  page        — sahifa raqami (default: 1)
  limit       — sahifadagi son (default: 20, max: 100)
```

**Response 200:**
```json
{
  "data": [{
    "id": "uuid",
    "name": "iPhone 15 Pro Max 256GB",
    "slug": "iphone-15-pro-max",
    "price": 1450000000,
    "original_price": 1600000000,
    "discount_percent": 9,
    "images": [{"url": "...", "alt": "..."}],
    "category": { "id": "uuid", "name": "Elektronika" },
    "seller": { "id": "uuid", "name": "TechZone UZ", "rating": 4.8 },
    "rating": 4.9,
    "review_count": 2847,
    "stock": 45,
    "is_new": true,
    "is_bestseller": true
  }],
  "meta": {
    "total": 15420,
    "page": 1,
    "limit": 20,
    "total_pages": 771
  }
}
```

---

### GET /products/:slug
Mahsulot tafsilotlari

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "iPhone 15 Pro Max",
    "description": "...",
    "price": 1450000000,
    "images": [...],
    "variants": [
      { "name": "Rang", "options": [
        { "value": "Natural Titanium", "price_delta": 0, "stock": 20 },
        { "value": "Blue Titanium", "price_delta": 0, "stock": 15 }
      ]}
    ],
    "specifications": [
      { "key": "Ekran", "value": "6.7\" Super Retina XDR" }
    ],
    "seller": { "id": "uuid", "shop_name": "TechZone UZ", "rating": 4.8, "total_sales": 8924 },
    "rating": 4.9,
    "review_count": 2847,
    "related_products": [...]
  }
}
```

---

### GET /products/:id/reviews
```
Query: page=1&limit=10&sort=newest|helpful
```

**Response 200:**
```json
{
  "data": [{
    "id": "uuid",
    "user": { "full_name": "Jasur T.", "avatar_url": null },
    "rating": 5,
    "comment": "Ajoyib telefon!",
    "images": [],
    "is_verified": true,
    "likes_count": 124,
    "created_at": "2024-01-18T10:00:00Z"
  }],
  "summary": { "average": 4.9, "breakdown": { "5": 74, "4": 18, "3": 5, "2": 2, "1": 1 } },
  "meta": { "total": 2847, "page": 1 }
}
```

---

### POST /products/:id/reviews  🔒 **(buyer)**
```json
{
  "rating": 5,
  "comment": "Juda yaxshi mahsulot!",
  "images": ["url1", "url2"],
  "order_id": "uuid"
}
```

---

## CART ENDPOINTS

### GET /cart  🔒
**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "items": [{
      "id": "uuid",
      "product": { "id": "uuid", "name": "...", "price": 1450000000, "stock": 45 },
      "quantity": 1,
      "selected_options": { "Rang": "Titanium" },
      "unit_price": 1450000000,
      "subtotal": 1450000000
    }],
    "summary": {
      "items_count": 3,
      "subtotal": 2000000000,
      "shipping_fee": 0,
      "discount": 0,
      "total": 2000000000
    }
  }
}
```

---

### POST /cart/items  🔒
```json
{
  "product_id": "uuid",
  "quantity": 1,
  "selected_options": { "Rang": "Qora", "Xotira": "256GB" }
}
```

---

### PATCH /cart/items/:id  🔒
```json
{ "quantity": 2 }
```

---

### DELETE /cart/items/:id  🔒

---

### POST /cart/apply-coupon  🔒
```json
{ "code": "MARKET10" }
```
**Response 200:**
```json
{
  "coupon": { "code": "MARKET10", "discount_type": "percent", "discount_value": 10 },
  "discount_amount": 200000000,
  "new_total": 1800000000
}
```

---

## ORDER ENDPOINTS

### POST /orders  🔒 **(buyer)**
```json
{
  "address_id": "uuid",
  "delivery_type": "standard",
  "payment_method": "click",
  "coupon_code": "MARKET10",
  "buyer_note": "Iltimos ehtiyotkorlik bilan"
}
```
**Response 201:**
```json
{
  "data": {
    "id": "uuid",
    "order_number": "ORD-2024-001248",
    "status": "created",
    "total_amount": 1800000000,
    "payment_url": "https://my.click.uz/pay?order=..."
  }
}
```

---

### GET /orders  🔒 **(buyer)**
```
Query: status?, page=1, limit=10
```

---

### GET /orders/:id  🔒

---

### GET /orders/:id/track
```
Public endpoint — tracking_number orqali ham ishlaydi
Query: tracking_number=TRK-2024-89742
```

**Response 200:**
```json
{
  "data": {
    "order_number": "ORD-2024-001247",
    "status": "in_transit",
    "tracking_number": "TRK-2024-89742",
    "estimated_delivery": "2024-01-24",
    "status_history": [
      { "status": "created", "label": "Buyurtma yaratildi", "timestamp": "2024-01-20T10:00:00Z", "note": "" },
      { "status": "paid", "label": "To'lov qabul qilindi", "timestamp": "2024-01-20T10:05:00Z" }
    ],
    "shipping_address": { "city": "Toshkent", "street": "Amir Temur 108" }
  }
}
```

---

### POST /orders/:id/cancel  🔒 **(buyer)**
```json
{ "reason": "Noto'g'ri o'lcham tanladim" }
```

---

## SELLER ENDPOINTS

### GET /seller/dashboard  🔒 **(seller)**
```
Query: period=7d|30d|90d
```
**Response 200:**
```json
{
  "data": {
    "stats": {
      "revenue": 28475000000,
      "revenue_growth": 23.5,
      "orders": 1247,
      "orders_growth": 18.2,
      "products": 342,
      "avg_rating": 4.8
    },
    "chart": [
      { "date": "2024-01-01", "revenue": 850000000, "orders": 42 }
    ],
    "top_products": [...],
    "recent_orders": [...]
  }
}
```

---

### GET /seller/products  🔒 **(seller)**
```
Query: status?, search?, page=1, limit=20
```

---

### POST /seller/products  🔒 **(seller)**
```json
{
  "name": "iPhone 15 Pro Max 256GB",
  "category_id": "uuid",
  "description": "...",
  "price": 1450000000,
  "original_price": 1600000000,
  "stock": 45,
  "sku": "APL-IP15PM-256-NT",
  "images": [{ "url": "...", "alt": "..." }],
  "variants": [
    { "name": "Rang", "options": [
      { "value": "Natural Titanium", "stock": 20, "sku": "APL-IP15PM-256-NT" }
    ]}
  ],
  "specifications": [
    { "key": "Ekran", "value": "6.7\" Super Retina XDR" }
  ],
  "weight_grams": 221,
  "tags": ["apple", "iphone", "flagship"]
}
```

---

### PATCH /seller/products/:id  🔒 **(seller)**
### DELETE /seller/products/:id  🔒 **(seller)**

---

### GET /seller/orders  🔒 **(seller)**
```
Query: status?, date_from?, date_to?, page=1
```

---

### PATCH /seller/orders/:id/status  🔒 **(seller)**
```json
{ "status": "preparing", "note": "Mahsulot tayyorlanmoqda" }
```

---

### GET /seller/analytics  🔒 **(seller)**
```
Query: period=7d|30d|90d, metric=revenue|orders|customers
```

---

### GET /seller/wallet  🔒 **(seller)**
**Response 200:**
```json
{
  "data": {
    "balance": 1520000000,
    "pending": 820000000,
    "total_earned": 28475000000,
    "payouts": [
      { "id": "uuid", "amount": 5000000000, "status": "completed", "date": "2024-01-15" }
    ]
  }
}
```

---

## ADMIN ENDPOINTS

### GET /admin/dashboard  🔒 **(admin)**
**Response:** Platform-wide statistika

---

### GET /admin/sellers  🔒 **(admin)**
```
Query: status=all|pending|approved|suspended, search?, page=1
```

---

### POST /admin/sellers/:id/approve  🔒 **(admin)**
### POST /admin/sellers/:id/suspend  🔒 **(admin)**
```json
{ "reason": "Qoidabuzarlik" }
```

---

### GET /admin/products  🔒 **(admin)**
```
Query: status=pending|active|rejected, seller_id?, category_id?
```

---

### POST /admin/products/:id/approve  🔒 **(admin)**
### POST /admin/products/:id/reject  🔒 **(admin)**
```json
{ "reason": "Noto'g'ri kategoriya" }
```

---

### GET /admin/orders  🔒 **(admin)**
### GET /admin/users  🔒 **(admin)**
### GET /admin/analytics/platform  🔒 **(admin)**
### POST /admin/banners  🔒 **(admin)**
### POST /admin/coupons  🔒 **(admin)**
### PATCH /admin/commission  🔒 **(admin)**

---

## LOGISTICS ENDPOINTS

### GET /logistics/shipments  🔒 **(logistics)**
```
Query: status?, warehouse_id?, date?
```

---

### POST /logistics/scan  🔒 **(logistics)**
```json
{
  "barcode": "PKG-001247",
  "action": "received",
  "warehouse_id": "uuid",
  "zone": "A-12"
}
```
**Response 200:**
```json
{
  "data": {
    "shipment_id": "uuid",
    "order_number": "ORD-2024-001247",
    "product": "iPhone 15 Pro Max",
    "buyer": "Jasur T.",
    "address": "Toshkent, Yunusobod",
    "action_applied": "received",
    "new_status": "at_warehouse"
  }
}
```

---

### PATCH /logistics/shipments/:id  🔒 **(logistics)**
```json
{
  "status": "in_transit",
  "courier_id": "uuid",
  "note": "Kuryerga topshirildi"
}
```

---

## USER PROFILE ENDPOINTS

### GET /users/me  🔒
### PATCH /users/me  🔒
```json
{ "full_name": "Jasur Toshmatov", "email": "jasur@example.com" }
```

### GET /users/me/addresses  🔒
### POST /users/me/addresses  🔒
### PATCH /users/me/addresses/:id  🔒
### DELETE /users/me/addresses/:id  🔒

### GET /users/me/wishlist  🔒
### POST /users/me/wishlist  🔒
```json
{ "product_id": "uuid" }
```
### DELETE /users/me/wishlist/:product_id  🔒

### GET /users/me/bonus  🔒
**Response 200:**
```json
{
  "data": {
    "balance": 1250,
    "value": 125000,
    "history": [
      { "amount": 150, "type": "earned", "reason": "Xarid uchun", "date": "2024-01-20" }
    ]
  }
}
```

---

## ERROR RESPONSES

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Mahsulot topilmadi",
    "details": null
  }
}
```

### Error Codes

| Code | HTTP | Tavsif |
|------|------|--------|
| UNAUTHORIZED | 401 | Token yo'q yoki noto'g'ri |
| FORBIDDEN | 403 | Ruxsat yo'q |
| NOT_FOUND | 404 | Resurs topilmadi |
| VALIDATION_ERROR | 422 | Noto'g'ri ma'lumot |
| OUT_OF_STOCK | 409 | Zaxirada yo'q |
| COUPON_EXPIRED | 409 | Kupon muddati o'tgan |
| COUPON_INVALID | 409 | Noto'g'ri kupon |
| RATE_LIMITED | 429 | Ko'p so'rov |
| SERVER_ERROR | 500 | Tizim xatosi |

---

## RATE LIMITING

| Endpoint | Limit |
|----------|-------|
| /auth/send-otp | 3 req/min |
| /products (GET) | 100 req/min |
| /orders (POST) | 10 req/min |
| Default | 60 req/min |

---

## WEBSOCKET EVENTS

```
ws://api.market.uz/ws?token=<access_token>
```

### Events (Server → Client)

```json
{ "event": "order.status_changed", "data": { "order_id": "uuid", "status": "in_transit" } }
{ "event": "order.new", "data": { "order_id": "uuid", "amount": 1450000000 } }
{ "event": "notification", "data": { "title": "Buyurtma yo'lda!", "body": "..." } }
{ "event": "stock.low", "data": { "product_id": "uuid", "stock": 3 } }
```

---

## NestJS BACKEND STRUCTURE

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── redis.config.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── send-otp.dto.ts
│   │   │   │   └── verify-otp.dto.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   ├── catalog/
│   │   │   ├── categories/
│   │   │   ├── products/
│   │   │   │   ├── products.module.ts
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-product.dto.ts
│   │   │   │       ├── update-product.dto.ts
│   │   │   │       └── product-filter.dto.ts
│   │   │   └── reviews/
│   │   ├── cart/
│   │   │   ├── cart.module.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   │   └── dto/
│   │   ├── orders/
│   │   │   ├── orders.module.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── dto/
│   │   ├── payments/
│   │   │   ├── payments.module.ts
│   │   │   ├── click/
│   │   │   │   ├── click.controller.ts   -- webhook
│   │   │   │   └── click.service.ts
│   │   │   └── payme/
│   │   │       ├── payme.controller.ts
│   │   │       └── payme.service.ts
│   │   ├── seller/
│   │   │   ├── seller.module.ts
│   │   │   ├── seller.controller.ts
│   │   │   ├── seller.service.ts
│   │   │   └── dto/
│   │   ├── admin/
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   └── admin.service.ts
│   │   ├── logistics/
│   │   │   ├── logistics.module.ts
│   │   │   ├── logistics.controller.ts
│   │   │   └── logistics.service.ts
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── telegram/
│   │   │   └── push/
│   │   ├── search/
│   │   │   ├── search.module.ts
│   │   │   ├── search.controller.ts
│   │   │   └── elasticsearch.service.ts
│   │   └── analytics/
│   │       ├── analytics.module.ts
│   │       ├── analytics.controller.ts
│   │       └── analytics.service.ts
│   └── websocket/
│       ├── events.gateway.ts
│       └── events.module.ts
├── test/
├── .env.example
├── package.json
└── nest-cli.json
```

---

## ENVIRONMENT VARIABLES

```env
# App
NODE_ENV=production
PORT=3001
APP_URL=https://api.market.uz

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=market_uz
DB_USER=market_user
DB_PASS=strong_password
DB_POOL_MAX=20

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=

# JWT
JWT_SECRET=super_secret_key_256bit
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d

# SMS (Eskiz.uz)
SMS_API_URL=https://notify.eskiz.uz/api
SMS_EMAIL=your@email.com
SMS_PASSWORD=

# Click
CLICK_MERCHANT_ID=
CLICK_SECRET_KEY=
CLICK_SERVICE_ID=

# Payme
PAYME_MERCHANT_ID=
PAYME_SECRET_KEY=

# AWS S3 / Cloud Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=market-uz-files
CDN_URL=https://cdn.market.uz

# Telegram Bot
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_URL=

# Elasticsearch
ES_HOST=localhost:9200
ES_INDEX_PRODUCTS=market_products

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```
