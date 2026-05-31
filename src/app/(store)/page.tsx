'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Zap, Star, TrendingUp, Package, ShieldCheck,
  Truck, RefreshCw, Headphones, ChevronLeft, ChevronRight,
  Flame, Sparkles, Crown, Timer
} from 'lucide-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { products, categories, banners } from '@/lib/mockData'
import ProductCard from '@/components/product/ProductCard'

function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [autoPlay])

  const heroData = [
    {
      title: 'iPhone 15 Pro Max',
      subtitle: 'Titanium. Kuchli. Pro.',
      description: 'A17 Pro chip, 48MP kamera tizimi, USB-C — yangi avlod smartphone',
      cta: 'Xarid qilish',
      href: '/products/iphone-15-pro-max',
      badge: '9% chegirma',
      price: "14 500 000 so'm",
      bg: 'from-slate-900 via-purple-950 to-slate-900',
      accent: 'text-purple-400',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    },
    {
      title: 'Yoz Kolleksiyasi 2024',
      subtitle: '500+ yangi uslublar',
      description: 'Premium brendlarning eng yangi kiyim va aksessuarlari',
      cta: "Ko'rish",
      href: '/category/kiyim',
      badge: 'Yangi keldi',
      price: "89 000 so'mdan",
      bg: 'from-rose-950 via-pink-950 to-slate-900',
      accent: 'text-pink-400',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    },
    {
      title: 'Super Chegirmalar',
      subtitle: '70% gacha tejash',
      description: 'Minglab mahsulotlarda katta chegirmalar — faqat bugun!',
      cta: "Chegirmalarni ko'rish",
      href: '/deals',
      badge: '24 soat qoldi',
      price: 'Chegirmadan foydalaning',
      bg: 'from-orange-950 via-amber-950 to-slate-900',
      accent: 'text-orange-400',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl h-[420px] md:h-[500px]" onMouseEnter={() => setAutoPlay(false)} onMouseLeave={() => setAutoPlay(true)}>
      {heroData.map((slide, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-all duration-700 ease-in-out',
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          )}
        >
          <div className={cn('absolute inset-0 bg-gradient-to-r', slide.bg)} />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5">
            <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-40 md:opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
          </div>
          <div className="relative z-10 h-full flex items-center px-8 md:px-12">
            <div className="max-w-lg">
              <span className={cn('inline-block px-3 py-1 rounded-full text-xs font-bold border border-current mb-4', slide.accent)}>
                {slide.badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">{slide.title}</h1>
              <p className={cn('text-lg md:text-xl font-semibold mb-2', slide.accent)}>{slide.subtitle}</p>
              <p className="text-surface-300 text-sm md:text-base mb-2">{slide.description}</p>
              <p className="text-white font-bold text-lg mb-6">{slide.price}</p>
              <Link href={slide.href} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-surface-900 font-semibold rounded-2xl hover:bg-surface-100 transition-colors text-sm">
                {slide.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {heroData.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={cn('rounded-full transition-all duration-300', i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70')} />
        ))}
      </div>
      <button onClick={() => { setAutoPlay(false); setCurrent((c) => (c - 1 + heroData.length) % heroData.length) }} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-xl flex items-center justify-center transition-all">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => { setAutoPlay(false); setCurrent((c) => (c + 1) % heroData.length) }} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-xl flex items-center justify-center transition-all">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

function FlashSaleTimer() {
  const [time, setTime] = useState({ h: 11, m: 45, s: 32 })
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 23; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="flex items-center gap-1.5">
      {[time.h, time.m, time.s].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="min-w-[2rem] h-8 bg-surface-900 dark:bg-surface-950 text-white text-sm font-bold rounded-lg flex items-center justify-center tabular-nums">{String(v).padStart(2, '0')}</span>
          {i < 2 && <span className="text-surface-900 dark:text-white font-bold text-sm">:</span>}
        </span>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="bg-surface-50 dark:bg-surface-950 min-h-screen">
      <section className="max-w-[1400px] mx-auto px-4 pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><HeroBanner /></div>
          <div className="flex flex-col gap-4">
            <Link href="/category/elektronika" className="relative rounded-2xl overflow-hidden h-[195px] bg-gradient-to-br from-blue-950 to-indigo-950 group">
              <Image src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" alt="MacBook" fill className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <p className="text-blue-300 text-xs font-semibold mb-1">Yangi keldi</p>
                <h3 className="text-white font-bold text-lg leading-tight">MacBook Air M3</h3>
                <p className="text-white/70 text-xs mt-1">19 500 000 so&apos;mdan</p>
              </div>
            </Link>
            <Link href="/deals" className="relative rounded-2xl overflow-hidden h-[195px] bg-gradient-to-br from-emerald-950 to-teal-950 group">
              <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" alt="Shoes" fill className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <p className="text-emerald-300 text-xs font-semibold mb-1">Flash Sale</p>
                <h3 className="text-white font-bold text-lg leading-tight">Nike Air Max</h3>
                <p className="text-white/70 text-xs mt-1">-26% chegirma</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Truck, title: 'Tez yetkazib berish', desc: '1-3 kun ichida', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
            { icon: ShieldCheck, title: "Xavfsiz to'lov", desc: '256-bit shifrlash', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
            { icon: RefreshCw, title: 'Oson qaytarish', desc: '30 kun ichida', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
            { icon: Headphones, title: '24/7 Yordam', desc: 'Har doim yordamda', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10' },
          ].map((item) => (
            <div key={item.title} className={cn('flex items-center gap-3 p-4 rounded-2xl', item.bg)}>
              <div className={cn('p-2 rounded-xl bg-white dark:bg-surface-900 shadow-sm', item.color)}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-surface-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">Kategoriyalar</h2>
            <p className="text-sm text-surface-500 mt-0.5">100 000+ mahsulot 12 ta kategoriyada</p>
          </div>
          <Link href="/categories" className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
            Barchasini ko&apos;rish <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-card transition-all duration-200 group">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
              <span className="text-[11px] font-medium text-surface-700 dark:text-surface-300 text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-10">
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl"><Zap className="h-6 w-6 text-white" /></div>
              <div>
                <h2 className="text-xl font-black text-white">Flash Sale</h2>
                <p className="text-white/80 text-sm">Cheklangan miqdorda!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm font-medium">Tugashiga:</span>
              <FlashSaleTimer />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white dark:bg-surface-900 rounded-2xl overflow-hidden">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-square bg-surface-50 dark:bg-surface-800">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    {product.discount && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">-{product.discount}%</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-surface-600 dark:text-surface-400 line-clamp-2 mb-1">{product.name}</p>
                    <p className="text-sm font-bold text-surface-900 dark:text-white">{formatPrice(product.price)}</p>
                    {product.originalPrice && <p className="text-xs text-surface-400 line-through">{formatPrice(product.originalPrice)}</p>}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-surface-400 mb-1">
                        <span>Sotildi: 65%</span>
                        <span className="text-orange-500 font-semibold">Kam qoldi!</span>
                      </div>
                      <div className="h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-3/5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl"><Flame className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div>
            <div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">Trend Mahsulotlar</h2>
              <p className="text-sm text-surface-500">Bu hafta eng ko&apos;p sotilgan</p>
            </div>
          </div>
          <Link href="/trending" className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
            Ko&apos;proq <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Elektronika Sale', subtitle: 'MacBook, iPhone, Samsung', discount: '-25%', bg: 'from-blue-600 to-indigo-700', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', href: '/category/elektronika' },
            { title: 'Sport Kiyimlar', subtitle: 'Nike, Adidas, Puma', discount: '-40%', bg: 'from-emerald-600 to-teal-700', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', href: '/category/sport' },
            { title: 'Uy Texnikasi', subtitle: 'Xiaomi, Samsung, LG', discount: '-30%', bg: 'from-orange-600 to-amber-700', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', href: '/category/uy-rozgor' },
          ].map((banner) => (
            <Link key={banner.title} href={banner.href} className={cn('relative rounded-2xl overflow-hidden h-40 bg-gradient-to-r group', banner.bg)}>
              <Image src={banner.image} alt={banner.title} fill className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <span className="self-start px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-lg">{banner.discount}</span>
                <div>
                  <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                  <p className="text-white/80 text-sm">{banner.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl"><Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></div>
            <div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">Yangi Keldilar</h2>
              <p className="text-sm text-surface-500">Oxirgi 7 kunda qo&apos;shilgan</p>
            </div>
          </div>
          <Link href="/new" className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
            Ko&apos;proq <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...products].reverse().slice(0, 5).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl"><Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" /></div>
            <div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">Eng Ko&apos;p Sotilgan</h2>
              <p className="text-sm text-surface-500">Xaridorlar eng ko&apos;p tanlagan</p>
            </div>
          </div>
          <Link href="/bestsellers" className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
            Ko&apos;proq <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.filter(p => p.isBestseller).concat(products.slice(0, 3)).slice(0, 5).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">O&apos;zbekistonning 1-Marketplace</h2>
            <p className="text-purple-200 text-sm">Ishonchli, tez va qulay xarid tajribasi</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '142K+', label: 'Faol xaridorlar', icon: '👥' },
              { value: '8.5K+', label: 'Tasdiqlangan sotuvchilar', icon: '🏪' },
              { value: '89K+', label: 'Faol mahsulotlar', icon: '📦' },
              { value: '18K+', label: 'Oylik buyurtmalar', icon: '🚀' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white mb-1"><span className="mr-1">{stat.icon}</span>{stat.value}</p>
                <p className="text-purple-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="bg-surface-900 dark:bg-surface-950 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-full mb-4">
              Biznes imkoniyati
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Market.uz&apos;da sotuvchi bo&apos;ling</h2>
            <p className="text-surface-400 mb-6">
              Minglab xaridorlarga yeting. Oson ro&apos;yxatdan o&apos;tish, qulay boshqaruv paneli,
              tezkor to&apos;lovlar va professional logistika xizmati.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {["Bepul ro'yxat", "Tezkor to'lov", 'Logistika yordami', 'AI tahlil'].map((f) => (
                <span key={f} className="px-3 py-1.5 bg-surface-800 text-surface-300 text-xs font-medium rounded-xl flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />{f}
                </span>
              ))}
            </div>
            <Link href="/seller/register" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl transition-colors text-sm">
              Hoziroq boshlang <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:w-56">
            {[
              { label: "O'rtacha daromad", value: "15M so'm/oy" },
              { label: 'Yetkazib berish', value: 'Bizda' },
              { label: 'Komissiya', value: '5-12%' },
              { label: "To'lov", value: 'Har kuni' },
            ].map((item) => (
              <div key={item.label} className="bg-surface-800 rounded-2xl p-4">
                <p className="text-surface-400 text-xs mb-1">{item.label}</p>
                <p className="text-white font-bold text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
