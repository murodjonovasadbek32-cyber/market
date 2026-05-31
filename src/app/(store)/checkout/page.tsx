'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, MapPin, Plus, Check, CreditCard, Smartphone,
  Wallet, ChevronRight, Shield, Truck, Clock, Edit2, ChevronDown
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { products } from '@/lib/mockData'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const STEPS = ['Manzil', "To'lov", 'Tasdiqlash']

const PAYMENT_METHODS = [
  { id: 'click', name: 'Click', icon: '⚡', color: 'from-blue-500 to-blue-600', desc: 'Tezkor to\'lov' },
  { id: 'payme', name: 'Payme', icon: '💳', color: 'from-emerald-500 to-emerald-600', desc: 'Onlayn to\'lov' },
  { id: 'uzum', name: 'Uzum Bank', icon: '🏦', color: 'from-orange-500 to-orange-600', desc: 'Uzum Bank' },
  { id: 'card', name: 'Karta', icon: '💳', color: 'from-purple-500 to-purple-600', desc: 'Visa / Mastercard' },
  { id: 'cash', name: 'Naqd', icon: '💵', color: 'from-gray-500 to-gray-600', desc: 'Qabul qilganda' },
  { id: 'installment', name: 'Bo\'lib to\'lash', icon: '📅', color: 'from-pink-500 to-pink-600', desc: '0% 12 oyga' },
]

const cartItems = [
  { product: products[0], quantity: 1 },
  { product: products[3], quantity: 2 },
]

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('click')
  const [selectedAddress, setSelectedAddress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [addingAddress, setAddingAddress] = useState(false)

  const addresses = [
    { id: 0, label: '🏠 Uy', name: 'Jasur Toshmatov', phone: '+998 90 123-45-67', address: 'Toshkent, Yunusobod tumani, Amir Temur ko\'chasi 108, 12-xonadon', isDefault: true },
    { id: 1, label: '🏢 Ofis', name: 'Jasur Toshmatov', phone: '+998 93 456-78-90', address: 'Toshkent, Mirzo Ulugbek tumani, Bunyodkor shoh. 54', isDefault: false },
  ]

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping = 0
  const total = subtotal + shipping

  const handleOrder = async () => {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 2000))
    setProcessing(false)
    setOrdered(true)
  }

  if (ordered) {
    return (
      <div className="bg-surface-50 dark:bg-surface-950 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-6">
            <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto animate-scale-in">
              <Check className="h-12 w-12 text-emerald-600" />
            </div>
            <div className="absolute -top-2 -right-2 text-3xl animate-float">🎉</div>
          </div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-white mb-2">Buyurtma qabul qilindi!</h1>
          <p className="text-surface-500 mb-2">Buyurtma raqami:</p>
          <p className="text-lg font-mono font-bold text-purple-600 mb-6">#ORD-2024-001248</p>

          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5 mb-6 text-left space-y-3">
            {[
              { icon: Clock, label: 'Taxminiy yetkazib berish', value: '2-3 ish kuni' },
              { icon: Truck, label: 'Tracking raqami', value: 'TRK-2024-89743' },
              { icon: Smartphone, label: 'SMS bildirishnoma', value: '+998 90 123-45-67' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="h-9 w-9 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                </div>
                <div>
                  <p className="text-xs text-surface-400">{item.label}</p>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Link href="/profile/orders" className="flex-1">
              <Button variant="outline" fullWidth>Buyurtmalarim</Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button fullWidth>Davom etish</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-50 dark:bg-surface-950 min-h-screen py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/cart" className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
            <ArrowLeft className="h-5 w-5 text-surface-600 dark:text-surface-400" />
          </Link>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Buyurtma rasmiylash</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn('flex items-center gap-2 text-sm font-medium transition-all', i <= step ? 'cursor-pointer' : 'cursor-default')}
              >
                <div className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  i < step ? 'bg-emerald-500 text-white' :
                  i === step ? 'bg-purple-600 text-white' :
                  'bg-surface-200 dark:bg-surface-700 text-surface-500'
                )}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={cn(
                  i === step ? 'text-surface-900 dark:text-white' : 'text-surface-400'
                )}>{s}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-0.5 w-12 rounded', i < step ? 'bg-emerald-500' : 'bg-surface-200 dark:bg-surface-700')} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-4">

            {/* Step 0 — Address */}
            {step === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
                  <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    Yetkazib berish manzili
                  </h2>
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={cn(
                          'w-full text-left p-4 rounded-2xl border-2 transition-all',
                          selectedAddress === addr.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                            : 'border-surface-100 dark:border-surface-800 hover:border-purple-200'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0',
                              selectedAddress === addr.id ? 'border-purple-500' : 'border-surface-300'
                            )}>
                              {selectedAddress === addr.id && <div className="h-2.5 w-2.5 bg-purple-500 rounded-full" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-semibold text-surface-900 dark:text-white">{addr.label}</span>
                                {addr.isDefault && <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-full">Asosiy</span>}
                              </div>
                              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{addr.name} · {addr.phone}</p>
                              <p className="text-xs text-surface-500 mt-0.5">{addr.address}</p>
                            </div>
                          </div>
                          <button className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </button>
                    ))}

                    {/* Add Address */}
                    {!addingAddress ? (
                      <button
                        onClick={() => setAddingAddress(true)}
                        className="w-full p-4 rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-700 hover:border-purple-300 dark:hover:border-purple-700 flex items-center gap-3 text-sm text-surface-500 hover:text-purple-600 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        Yangi manzil qo'shish
                      </button>
                    ) : (
                      <div className="p-4 rounded-2xl border-2 border-purple-200 dark:border-purple-800 space-y-3">
                        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Yangi manzil</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <Input label="Ism Familiya" placeholder="To'liq ism" />
                          <Input label="Telefon" placeholder="+998 90 000-00-00" />
                        </div>
                        <Input label="Viloyat / Shahar" placeholder="Toshkent" />
                        <Input label="Ko'cha, uy raqami" placeholder="Amir Temur ko'chasi, 108" />
                        <Input label="Xonadon / Ofis" placeholder="12-xonadon (ixtiyoriy)" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => setAddingAddress(false)}>Saqlash</Button>
                          <Button variant="ghost" size="sm" onClick={() => setAddingAddress(false)}>Bekor qilish</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
                  <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-purple-600" />
                    Yetkazib berish turi
                  </h2>
                  <div className="space-y-3">
                    {[
                      { id: 'standard', label: 'Standart yetkazib berish', time: '2-3 ish kuni', price: 0, badge: 'Bepul' },
                      { id: 'express', label: 'Ekspress yetkazib berish', time: 'Ertaga 12:00 gacha', price: 25000, badge: '' },
                      { id: 'pickup', label: 'O\'zim olib ketaman', time: 'Bugun dan boshlab', price: 0, badge: 'Bepul' },
                    ].map((opt, i) => (
                      <label key={opt.id} className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                        i === 0 ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/10' : 'border-surface-100 dark:border-surface-800 hover:border-purple-200'
                      )}>
                        <input type="radio" name="delivery" defaultChecked={i === 0} className="text-purple-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-surface-900 dark:text-white">{opt.label}</p>
                          <p className="text-xs text-surface-400 flex items-center gap-1"><Clock className="h-3 w-3" />{opt.time}</p>
                        </div>
                        <span className={cn('text-sm font-semibold', opt.price === 0 ? 'text-emerald-600' : 'text-surface-900 dark:text-white')}>
                          {opt.badge || formatPrice(opt.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={() => setStep(1)} rightIcon={<ChevronRight className="h-4 w-4" />}>
                  To'lov usuliga o'tish
                </Button>
              </div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
                  <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    To'lov usulini tanlang
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          'p-4 rounded-2xl border-2 text-left transition-all',
                          paymentMethod === method.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                            : 'border-surface-100 dark:border-surface-800 hover:border-purple-200'
                        )}
                      >
                        <span className="text-2xl block mb-1">{method.icon}</span>
                        <p className="text-sm font-semibold text-surface-900 dark:text-white">{method.name}</p>
                        <p className="text-[11px] text-surface-400">{method.desc}</p>
                        {paymentMethod === method.id && (
                          <div className="mt-1.5 flex items-center gap-1 text-purple-600 text-xs font-medium">
                            <Check className="h-3 w-3" /> Tanlandi
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-3 p-4 bg-surface-50 dark:bg-surface-800 rounded-2xl">
                      <Input label="Karta raqami" placeholder="0000 0000 0000 0000" leftIcon={<CreditCard className="h-4 w-4" />} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Amal qilish muddati" placeholder="MM/YY" />
                        <Input label="CVV" placeholder="***" />
                      </div>
                      <Input label="Karta egasining ismi" placeholder="JASUR TOSHMATOV" />
                    </div>
                  )}

                  {paymentMethod === 'installment' && (
                    <div className="mt-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-2xl">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Bo'lib to'lash muddati</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[3, 6, 12].map((months) => (
                          <button key={months} className="p-3 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 text-center hover:border-purple-400 transition-all">
                            <p className="text-lg font-black text-surface-900 dark:text-white">{months}</p>
                            <p className="text-xs text-surface-400">oy</p>
                            <p className="text-xs font-semibold text-purple-600 mt-1">
                              {formatPrice(Math.round(total / months))}/oy
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setStep(0)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Orqaga
                  </Button>
                  <Button fullWidth size="lg" onClick={() => setStep(2)} rightIcon={<ChevronRight className="h-4 w-4" />}>
                    Tasdiqlashga o'tish
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2 — Confirm */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
                  <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">Buyurtmani tasdiqlash</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-surface-50 dark:bg-surface-800 flex-shrink-0">
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-surface-400">{item.quantity} ta × {formatPrice(item.product.price)}</p>
                        </div>
                        <p className="text-sm font-bold text-surface-900 dark:text-white whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-surface-100 dark:border-surface-800">
                    <div>
                      <p className="text-xs font-semibold text-surface-500 mb-1 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />MANZIL</p>
                      <p className="text-sm text-surface-900 dark:text-white">{addresses[selectedAddress].address}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-surface-500 mb-1 flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" />TO'LOV</p>
                      <p className="text-sm text-surface-900 dark:text-white capitalize">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Orqaga
                  </Button>
                  <Button fullWidth size="lg" isLoading={processing} onClick={handleOrder}>
                    {processing ? 'Yuklanmoqda...' : `${formatPrice(total)} — Buyurtma berish`}
                  </Button>
                </div>
                <p className="text-center text-xs text-surface-400 flex items-center justify-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Buyurtma berganda siz foydalanish shartlariga rozisiz
                </p>
              </div>
            )}
          </div>

          {/* Right — Summary */}
          <div>
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5 sticky top-20">
              <h3 className="font-bold text-surface-900 dark:text-white mb-4">Buyurtma ({cartItems.length} ta)</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-surface-50 dark:bg-surface-800 flex-shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-900 dark:text-white line-clamp-2">{item.product.name}</p>
                    </div>
                    <p className="text-xs font-bold text-surface-900 dark:text-white whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-3 border-t border-surface-100 dark:border-surface-800 text-sm">
                <div className="flex justify-between"><span className="text-surface-500">Mahsulotlar</span><span className="font-medium text-surface-900 dark:text-white">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-surface-500">Yetkazib berish</span><span className="font-medium text-emerald-600">Bepul</span></div>
                <div className="flex justify-between pt-2 border-t border-surface-100 dark:border-surface-800">
                  <span className="font-bold text-surface-900 dark:text-white">Jami</span>
                  <span className="text-lg font-black text-surface-900 dark:text-white">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
