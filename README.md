# 🛍️ Market.uz — O'zbekistonning Premium Marketplace Platformasi

> Millionlab xaridorlar va minglab sotuvchilar uchun zamonaviy ekotizim

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![NestJS](https://img.shields.io/badge/NestJS-10-e0234e?logo=nestjs)

---

## 🌟 Platforma haqida

**Market.uz** — O'zbekiston uchun yaratilgan, 2026-yil darajasida premium marketplace ekotizimi.

### 4 ta asosiy portal:

| Portal | URL | Foydalanuvchi |
|--------|-----|---------------|
| 🛒 **Do'kon** | `/` | Xaridorlar |
| 🏪 **Seller Kabineti** | `/seller` | Sotuvchilar |
| 🛡️ **Admin Panel** | `/admin` | Administratorlar |
| 📦 **Logistika** | `/logistics` | Ombor xodimlari |

---

## ✨ Asosiy xususiyatlar

### Xaridorlar uchun
- 🔍 AI qidiruv + ovozli qidiruv + QR qidiruv
- 🎯 Smart filter va saralash
- 🛒 Qulay savatcha va 3-bosqichli checkout
- 📱 Click, Payme, Uzum, Karta, Naqd, Bo'lib to'lash
- 📦 Real-time buyurtma kuzatish (8 bosqich)
- 💎 Bonus ball tizimi
- ❤️ Sevimlilar ro'yxati
- 🌙 Dark/Light Mode

### Sotuvchilar uchun
- 📊 Real-time dashboard va statistika
- 📦 Mahsulot boshqaruvi (variantlar, SKU, barcode)
- 📈 Savdo analitikasi va grafiklar
- 💰 Hamyon va to'lov boshqaruvi
- ⭐ Sharh boshqaruvi

### Admin Panel
- 🌐 Platform-wide statistika
- ✅ Seller tasdiqlash/to'xtatish
- 🔍 Mahsulot moderatsiyasi
- 📢 Banner boshqaruvi
- 💹 Komissiya sozlamalari

### Logistika
- 📷 Barcode/QR skanerlash
- 🏭 Ombor zona boshqaruvi
- 🚚 Real-time buyurtma kuzatish
- 📊 Soatlik statistika

---

## 🏗️ Texnologiya stacki

### Frontend
```
Next.js 14 (App Router)   — Framework
TypeScript 5              — Til
Tailwind CSS 3.4          — Styling
Framer Motion             — Animatsiyalar
Recharts                  — Grafiklar
Lucide React              — Ikonalar
Zustand                   — State management
next-themes               — Dark/Light mode
react-hot-toast           — Notifications
```

### Backend (arxitektura)
```
NestJS 10                 — Framework
PostgreSQL 16             — Asosiy database
Redis                     — Cache & Sessions
Elasticsearch             — Qidiruv tizimi
WebSocket                 — Real-time
JWT + Refresh Token       — Auth
```

### DevOps
```
Docker + Docker Compose   — Containerization
Nginx                     — Reverse proxy
AWS S3 / CloudFlare R2    — File storage
GitHub Actions            — CI/CD
```

---

## 🗂️ Loyiha strukturasi

```
market/
├── src/
│   ├── app/
│   │   ├── (store)/           # Xaridor portali
│   │   │   ├── page.tsx       # Bosh sahifa
│   │   │   ├── products/      # Mahsulot sahifasi
│   │   │   ├── search/        # Qidiruv
│   │   │   ├── cart/          # Savatcha
│   │   │   ├── checkout/      # Buyurtma rasmiylash
│   │   │   └── profile/       # Profil
│   │   ├── seller/            # Seller kabineti
│   │   │   ├── page.tsx       # Dashboard
│   │   │   └── products/      # Mahsulot boshqaruvi
│   │   ├── admin/             # Admin panel
│   │   │   ├── page.tsx       # Super dashboard
│   │   │   └── sellers/       # Seller boshqaruvi
│   │   └── logistics/         # Logistika
│   │       ├── page.tsx       # Ombor dashboard
│   │       └── tracking/      # Kuzatish
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── product/           # ProductCard
│   │   ├── ui/                # Button, Card, Input, Badge...
│   │   └── providers/         # ThemeProvider
│   └── lib/
│       ├── utils.ts           # Helper funksiyalar
│       ├── types.ts           # TypeScript tiplar
│       └── mockData.ts        # Demo ma'lumotlar
├── docs/
│   ├── DATABASE_SCHEMA.md     # PostgreSQL sxema
│   └── API_DOCUMENTATION.md  # REST API docs
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 🚀 Ishga tushurish

```bash
# 1. Paketlarni o'rnatish
npm install

# 2. .env faylini sozlash
cp .env.example .env.local

# 3. Dev serverni ishga tushurish
npm run dev

# 4. Production build
npm run build
npm start
```

---

## 🎨 Design System

### Ranglar
| Token | Light | Dark | Ishlatilishi |
|-------|-------|------|-------------|
| Purple 600 | `#9333ea` | `#a855f7` | Asosiy accent |
| Emerald 500 | `#10b981` | `#10b981` | Success, yashil |
| Surface 50-950 | `#fafafa`→`#09090b` | — | Fon va matn |

### Tipografiya
- **Font:** Inter (Google Fonts)
- **Headings:** 700-900 weight
- **Body:** 400-500 weight

---

## 📊 Database

**5 ta schema, 25+ jadval:**

```
auth.*        — Foydalanuvchilar, tokenlar, OTP
catalog.*     — Kategoriyalar, mahsulotlar, sharhlar
commerce.*    — Buyurtmalar, to'lovlar, kuponlar
logistics.*   — Omborlar, paketlar, skanerlar
analytics.*   — Statistika, qidiruvlar, ko'rishlar
```

Batafsil: [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md)

---

## 🔌 API

**REST API + WebSocket:**

- Base URL: `https://api.market.uz/v1`
- Auth: JWT Bearer Token
- Format: JSON

Batafsil: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)

---

## 📁 Sahifalar ro'yxati

| Sahifa | URL | Tavsif |
|--------|-----|--------|
| Bosh sahifa | `/` | Hero, kategoriyalar, mahsulotlar |
| Qidiruv | `/search` | Filter, sort, grid/list |
| Mahsulot | `/products/[slug]` | Detail, variantlar, sharhlar |
| Savatcha | `/cart` | Kupon, miqdor |
| Checkout | `/checkout` | Manzil, to'lov, tasdiqlash |
| Profil | `/profile` | Overview, buyurtmalar, tracking |
| Seller | `/seller` | Dashboard, statistika |
| Seller mahsulotlar | `/seller/products` | CRUD, import/export |
| Admin | `/admin` | Platform statistika |
| Admin sellerlar | `/admin/sellers` | Tasdiqlash/rad etish |
| Logistika | `/logistics` | Ombor dashboard |
| Tracking | `/logistics/tracking` | Buyurtma kuzatish |

---

## 🤝 Hissa qo'shish

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing-feature`)
3. Commit qiling (`git commit -m 'feat: add amazing feature'`)
4. Push qiling (`git push origin feature/amazing-feature`)
5. Pull Request oching

---

## 📄 Litsenziya

MIT License — batafsil `LICENSE` faylini ko'ring.

---

<div align="center">

**Market.uz** — O'zbekiston digital savdosining kelajagi 🇺🇿

*Investor demo uchun tayyor | Production ready architecture*

</div>
