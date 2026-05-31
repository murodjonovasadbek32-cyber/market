'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingCart, Trash2, Plus, Minus, Tag, Truck, Shield,
  ChevronRight, ArrowLeft, Gift, Zap, Info, Check
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { products } from '@/lib/mockData'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

interface CartItem {
  product: typeof products[0]
  quantity: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[3], quantity: 2 },
    { product: products[4], quantity: 1 },
  ])
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [selected, setSelected] = useState<string[]>(items.map(i => i.product.id))

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.product.id === id
        ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, item.quantity + delta)) }
        : item
    ))
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.product.id !== id))
    toast.success('Savatchadan olib tashlandi')
  }

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'MARKET10') {
      setCouponApplied(true)
      toast.success('🎉 Kupon qo\'llanildi! 10% chegirma')
    } else {
      toast.error('Noto\'g\'ri kupon kodi')
    }
  }

  const selectedItems = items.filter(item => selected.includes(item.product.id))
  const subtotal = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const shipping = subtotal > 500000 ? 0 : 30000
  const total = subtotal - discount + shipping

  return (
    <div className="bg-surface-50 dark:bg-surface-950 min-h-screen py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <ArrowLeft className="h-5 w-5 text-surface-600 dark:text-surface-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Savatcha</h1>
            <p className="text-sm text-surface-500">{items.length} ta mahsulot</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 bg-surface-100 dark:bg-surface-800 rounded-3xl flex items-center justify-center mb-4">
              <ShoppingCart className="h-10 w-10 text-surface-400" />
            </div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Savatcha bo'sh</h2>
            <p className="text-surface-500 mb-6">Xarid qilishni boshlang!</p>
            <Link href="/">
              <Button size="lg">Xarid qilish</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {/* Select All */}
              <div className="flex items-center justify-between bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 px-4 py-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.length === items.length}
                    onChange={() => setSelected(selected.length === items.length ? [] : items.map(i => i.product.id))}
                    className="h-4 w-4 rounded border-surface-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-surface-900 dark:text-white">
                    Barchasini tanlash ({items.length})
                  </span>
                </label>
                {selected.length > 0 && (
                  <button
                    onClick={() => {
                      setItems(prev => prev.filter(item => !selected.includes(item.product.id)))
                      setSelected([])
                      toast.success('Tanlangan mahsulotlar olib tashlandi')
                    }}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    O'chirish
                  </button>
                )}
              </div>

              {/* Items */}
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className={cn(
                    'bg-white dark:bg-surface-900 rounded-2xl border transition-all',
                    selected.includes(item.product.id)
                      ? 'border-purple-200 dark:border-purple-800'
                      : 'border-surface-100 dark:border-surface-800'
                  )}
                >
                  <div className="flex gap-4 p-4">
                    {/* Checkbox */}
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.product.id)}
                        onChange={() => toggleSelect(item.product.id)}
                        className="h-4 w-4 rounded border-surface-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    {/* Image */}
                    <Link href={`/products/${item.product.slug}`} className="relative h-20 w-20 rounded-xl overflow-hidden bg-surface-50 dark:bg-surface-800 flex-shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${item.product.slug}`} className="text-sm font-medium text-surface-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 line-clamp-2">
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-surface-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-surface-400 mt-0.5">{item.product.sellerName}</p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty */}
                        <div className="flex items-center gap-1 bg-surface-50 dark:bg-surface-800 rounded-xl p-1">
                          <button
                            onClick={() => updateQty(item.product.id, -1)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-surface-700 transition-colors text-surface-500"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-surface-900 dark:text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.product.id, 1)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-surface-700 transition-colors text-surface-500"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-base font-bold text-surface-900 dark:text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-surface-400">{formatPrice(item.product.price)} × {item.quantity}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping info */}
                  <div className="px-4 pb-3 flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      {item.product.price > 500000 ? 'Bepul yetkazib berish' : 'Yetkazib berish: 30 000 so\'m'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Kupon kodi</h3>
                </div>
                {couponApplied ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">MARKET10 — 10% chegirma qo'llanildi!</span>
                    <button onClick={() => { setCouponApplied(false); setCoupon('') }} className="ml-auto text-xs text-emerald-600 hover:text-emerald-700">O'chirish</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Kupon kodini kiriting (MARKET10)"
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                    />
                    <Button variant="outline" onClick={applyCoupon}>Qo'llash</Button>
                  </div>
                )}
                <p className="text-xs text-surface-400 mt-2 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Test kupon: MARKET10 (10% chegirma)
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5 sticky top-20">
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-5">Buyurtma xulosasi</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Mahsulotlar ({selectedItems.reduce((s, i) => s + i.quantity, 0)} ta)</span>
                    <span className="text-surface-900 dark:text-white font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600 flex items-center gap-1"><Tag className="h-3.5 w-3.5" />Kupon chegirmasi</span>
                      <span className="text-emerald-600 font-medium">−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500 flex items-center gap-1"><Truck className="h-3.5 w-3.5" />Yetkazib berish</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'text-surface-900 dark:text-white font-medium'}>
                      {shipping === 0 ? 'Bepul' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="h-px bg-surface-100 dark:bg-surface-800" />
                  <div className="flex justify-between">
                    <span className="font-bold text-surface-900 dark:text-white">Jami</span>
                    <span className="text-xl font-black text-surface-900 dark:text-white">{formatPrice(total)}</span>
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 text-right">
                      💰 {formatPrice(discount)} tejadingiz!
                    </p>
                  )}
                </div>

                <Link href="/checkout">
                  <Button fullWidth size="lg" rightIcon={<ChevronRight className="h-4 w-4" />}>
                    Rasmiylashtirish
                  </Button>
                </Link>

                <Link href="/checkout?method=fast">
                  <Button variant="success" fullWidth size="lg" className="mt-3" leftIcon={<Zap className="h-4 w-4" />}>
                    Tez xarid
                  </Button>
                </Link>

                {/* Payment Methods */}
                <div className="mt-5 pt-4 border-t border-surface-100 dark:border-surface-800">
                  <p className="text-xs text-surface-400 text-center mb-3">Qabul qilinadigan to'lov usullari</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {['Click', 'Payme', 'Uzum', 'Visa', 'MC'].map((m) => (
                      <span key={m} className="px-2.5 py-1 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs font-bold rounded-lg text-surface-600 dark:text-surface-400">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trust */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-surface-400">
                  <Shield className="h-3.5 w-3.5" />
                  <span>256-bit SSL xavfsiz to'lov</span>
                </div>
              </div>

              {/* Gift */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Gift className="h-4 w-4" />
                  <span className="text-sm font-bold">Sovg'a quti</span>
                </div>
                <p className="text-xs text-purple-200">Mahsulotni sovg'a sifatida jo'nating — maxsus qadoqlash bilan</p>
                <button className="mt-2 text-xs font-semibold text-white underline">Qo'shish</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
