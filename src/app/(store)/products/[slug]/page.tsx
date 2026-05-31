'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart, ShoppingCart, Zap, Star, Share2, Shield, Truck,
  RefreshCw, ChevronRight, Minus, Plus, Check, MessageSquare,
  ThumbsUp, Store, Package, Award, ChevronDown, ChevronUp,
  Camera, Play, ZoomIn
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { products, reviews } from '@/lib/mockData'
import ProductCard from '@/components/product/ProductCard'
import Rating from '@/components/ui/Rating'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import toast from 'react-hot-toast'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug) || products[0]
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [liked, setLiked] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const [showFullDesc, setShowFullDesc] = useState(false)

  const images = [...(product.images), 
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80',
  ]

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 5)

  const ratingBreakdown = [
    { stars: 5, count: 2100, percent: 74 },
    { stars: 4, count: 520, percent: 18 },
    { stars: 3, count: 140, percent: 5 },
    { stars: 2, count: 57, percent: 2 },
    { stars: 1, count: 30, percent: 1 },
  ]

  return (
    <div className="bg-surface-50 dark:bg-surface-950 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-6">
          {['Bosh sahifa', 'Elektronika', 'Smartfonlar', product.name].map((item, i, arr) => (
            <span key={i} className="flex items-center gap-1.5">
              {i < arr.length - 1 ? (
                <>
                  <Link href="/" className="text-surface-500 hover:text-purple-600 transition-colors">{item}</Link>
                  <ChevronRight className="h-3.5 w-3.5 text-surface-300" />
                </>
              ) : (
                <span className="text-surface-900 dark:text-white font-medium truncate max-w-xs">{item}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left — Images */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-surface-900 rounded-3xl border border-surface-100 dark:border-surface-800 overflow-hidden group">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <Badge variant="success">YANGI</Badge>}
                {product.discount && (
                  <Badge variant="error">-{product.discount}%</Badge>
                )}
              </div>
              {/* Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => { setLiked(!liked); toast.success(liked ? 'Olib tashlandi' : '❤️ Sevimlilarga qo\'shildi') }}
                  className={cn(
                    'h-10 w-10 rounded-2xl flex items-center justify-center transition-all',
                    'bg-white dark:bg-surface-800 shadow-card',
                    liked ? 'text-red-500' : 'text-surface-400 hover:text-red-500'
                  )}
                >
                  <Heart className={cn('h-5 w-5', liked && 'fill-red-500')} />
                </button>
                <button className="h-10 w-10 rounded-2xl flex items-center justify-center bg-white dark:bg-surface-800 shadow-card text-surface-400 hover:text-purple-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="h-10 w-10 rounded-2xl flex items-center justify-center bg-white dark:bg-surface-800 shadow-card text-surface-400 hover:text-purple-600 transition-colors">
                  <ZoomIn className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all',
                    selectedImage === i
                      ? 'border-purple-500 shadow-purple'
                      : 'border-surface-100 dark:border-surface-800 hover:border-purple-300'
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
              {/* Video thumb */}
              <button className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden border-2 border-surface-100 dark:border-surface-800 hover:border-purple-300 bg-surface-100 dark:bg-surface-800 flex items-center justify-center transition-all">
                <Play className="h-6 w-6 text-surface-500" />
              </button>
            </div>
          </div>

          {/* Right — Product Info */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="text-xs text-surface-500">{product.brand}</span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <Rating value={product.rating} showValue count={product.reviewCount} />
                <span className="text-xs text-surface-400">|</span>
                <span className="text-xs text-surface-500">SKU: <span className="font-mono">{product.sku}</span></span>
                <span className={cn('text-xs font-medium', product.stock > 0 ? 'text-emerald-600' : 'text-red-500')}>
                  {product.stock > 0 ? `✓ Mavjud (${product.stock} ta)` : '✗ Mavjud emas'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-surface-50 dark:bg-surface-900/50 rounded-2xl p-4 border border-surface-100 dark:border-surface-800">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-surface-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg text-surface-400 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-lg">
                      -{product.discount}%
                    </span>
                  </div>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  💰 Tejash: {formatPrice(product.originalPrice - product.price)}
                </p>
              )}
              <div className="flex gap-4 mt-3 pt-3 border-t border-surface-100 dark:border-surface-800">
                <div className="text-center">
                  <p className="text-xs text-surface-400">Installment</p>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    {formatPrice(Math.round(product.price / 12))}/oy
                  </p>
                  <p className="text-[10px] text-surface-400">12 oyga</p>
                </div>
                <div className="w-px bg-surface-100 dark:bg-surface-800" />
                <div className="text-center">
                  <p className="text-xs text-surface-400">Bonus ball</p>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    +{Math.round(product.price * 0.01 / 1000)} ball
                  </p>
                  <p className="text-[10px] text-surface-400">xarid uchun</p>
                </div>
                <div className="w-px bg-surface-100 dark:bg-surface-800" />
                <div className="text-center">
                  <p className="text-xs text-surface-400">Yetkazib berish</p>
                  <p className="text-sm font-semibold text-emerald-600">Bepul</p>
                  <p className="text-[10px] text-surface-400">1-3 kun</p>
                </div>
              </div>
            </div>

            {/* Variants */}
            {[
              { name: 'Rang', options: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'] },
              { name: 'Xotira', options: ['256GB', '512GB', '1TB'] },
            ].map((variant) => (
              <div key={variant.name}>
                <p className="text-sm font-semibold text-surface-900 dark:text-white mb-2">
                  {variant.name}: <span className="text-purple-600 font-normal">{selectedVariants[variant.name] || variant.options[0]}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-sm font-medium border transition-all',
                        (selectedVariants[variant.name] || variant.options[0]) === opt
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                          : 'border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-purple-300'
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">Miqdor:</p>
              <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-surface-700 transition-colors text-surface-600 dark:text-surface-400"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-surface-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-surface-700 transition-colors text-surface-600 dark:text-surface-400"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-surface-400">Jami: <span className="font-semibold text-surface-900 dark:text-white">{formatPrice(product.price * quantity)}</span></span>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <Button
                size="lg"
                fullWidth
                leftIcon={<ShoppingCart className="h-5 w-5" />}
                onClick={() => toast.success('🛒 Savatchaga qo\'shildi!')}
              >
                Savatchaga
              </Button>
              <Button
                variant="success"
                size="lg"
                fullWidth
                leftIcon={<Zap className="h-5 w-5" />}
              >
                Hozir xarid
              </Button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: 'Kafolatli mahsulot', color: 'text-emerald-500' },
                { icon: Truck, text: '1-3 kun yetkazib berish', color: 'text-blue-500' },
                { icon: RefreshCw, text: '30 kun qaytarish', color: 'text-purple-500' },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center gap-1.5 p-3 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-100 dark:border-surface-800 text-center">
                  <item.icon className={cn('h-5 w-5', item.color)} />
                  <span className="text-[11px] font-medium text-surface-600 dark:text-surface-400">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Seller */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <Store className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{product.sellerName}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-surface-500">{product.sellerRating} reyting</span>
                    <span className="text-xs text-surface-400">· 1,247 ta sotib</span>
                  </div>
                </div>
              </div>
              <Link href="/seller/techzone-uz" className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
                Do'konga borish <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-100 dark:border-surface-800 mb-8 overflow-hidden">
          <div className="flex border-b border-surface-100 dark:border-surface-800">
            {[
              { key: 'description', label: 'Tavsif' },
              { key: 'specs', label: 'Xarakteristikalar' },
              { key: 'reviews', label: `Sharhlar (${product.reviewCount.toLocaleString()})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  'flex-1 py-4 text-sm font-semibold transition-all border-b-2 -mb-px',
                  activeTab === tab.key
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-white'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <div className={cn('prose prose-sm dark:prose-invert max-w-none', !showFullDesc && 'line-clamp-6')}>
                  <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-surface-600 dark:text-surface-400 leading-relaxed mt-4">
                    iPhone 15 Pro Max Apple'ning eng yuqori darajali smartfoni bo'lib, A17 Pro chipset 
                    bilan jihozlangan. Bu chip 6-yadroli CPU va 6-yadroli GPU'ga ega bo'lib, mashinali 
                    o'rganish va sun'iy intellekt uchun maxsus Neural Engine bilan ta'minlangan.
                  </p>
                  <p className="text-surface-600 dark:text-surface-400 leading-relaxed mt-4">
                    Kamera tizimi 48MP asosiy kamera, 12MP ultrawide va 12MP 5x optik zoom telephoto 
                    kameralaridan iborat. ProRes video va Log video qo'llab-quvvatlashi professional 
                    videograflar uchun ideal imkoniyatlar yaratadi.
                  </p>
                </div>
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  {showFullDesc ? <><ChevronUp className="h-4 w-4" />Kamroq ko'rsatish</> : <><ChevronDown className="h-4 w-4" />Ko'proq ko'rsatish</>}
                </button>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'Ekran', value: '6.7" Super Retina XDR, 2796x1290, 460 ppi' },
                  { key: 'Protsessor', value: 'Apple A17 Pro (3nm), 6 yadroli CPU' },
                  { key: 'Xotira', value: '8GB RAM, 256GB/512GB/1TB' },
                  { key: 'Kamera', value: '48MP (asosiy) + 12MP (ultra) + 12MP (5x zoom)' },
                  { key: 'Batareya', value: '4422 mAh, 20W ProRes Charging' },
                  { key: 'OS', value: 'iOS 17' },
                  { key: 'Korpus', value: 'Grade 5 Titanium, Ceramic Shield' },
                  { key: 'Aloqa', value: '5G, Wi-Fi 6E, Bluetooth 5.3, UWB, NFC' },
                  { key: 'Sensor', value: 'Face ID, Barometer, Gyroscope' },
                  { key: 'USB', value: 'USB-C USB 3 (40Gb/s)' },
                  { key: 'Dimensions', value: '159.9 × 76.7 × 8.25 mm' },
                  { key: 'Og\'irlik', value: '221 g' },
                ].map((spec) => (
                  <div key={spec.key} className="flex gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                    <span className="text-sm font-semibold text-surface-700 dark:text-surface-300 w-32 shrink-0">{spec.key}</span>
                    <span className="text-sm text-surface-600 dark:text-surface-400">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row gap-6 p-5 bg-surface-50 dark:bg-surface-800 rounded-2xl">
                  <div className="text-center">
                    <p className="text-6xl font-black text-surface-900 dark:text-white">{product.rating}</p>
                    <Rating value={product.rating} size="md" className="justify-center mt-1" />
                    <p className="text-xs text-surface-400 mt-1">{product.reviewCount.toLocaleString()} sharh</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingBreakdown.map((r) => (
                      <div key={r.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-8">
                          <span className="text-xs text-surface-600 dark:text-surface-400">{r.stars}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="flex-1 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r.percent}%` }} />
                        </div>
                        <span className="text-xs text-surface-400 w-6">{r.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Write Review */}
                <button className="w-full py-3 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-2xl text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Sharh yozish
                </button>

                {/* Reviews List */}
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-surface-100 dark:border-surface-800 pb-5 last:border-0">
                    <div className="flex items-start gap-3">
                      <Avatar name={review.userName} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-surface-900 dark:text-white">{review.userName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Rating value={review.rating} size="xs" />
                              <span className="text-xs text-surface-400">{review.createdAt}</span>
                              <Badge variant="success" size="sm">✓ Tasdiqlangan xarid</Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-surface-600 dark:text-surface-400 mt-2 leading-relaxed">
                          {review.comment}
                        </p>
                        <button className="mt-2 flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-600 transition-colors">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Foydali ({review.likes})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-5">O'xshash mahsulotlar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
