'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package, Heart, MapPin, CreditCard, Gift, Star, Bell,
  Settings, LogOut, ChevronRight, Edit2, Camera, Shield,
  Truck, CheckCircle, Clock, RotateCcw, Award, Zap,
  TrendingUp, ShoppingBag
} from 'lucide-react'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import { orders } from '@/lib/mockData'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  created:      { label: 'Yaratildi',          color: 'text-surface-500', icon: Clock },
  paid:         { label: 'To\'lov qilindi',    color: 'text-blue-500',    icon: CreditCard },
  preparing:    { label: 'Tayyorlanmoqda',     color: 'text-yellow-500',  icon: Package },
  at_warehouse: { label: 'Omborga yetdi',      color: 'text-orange-500',  icon: Shield },
  sorting:      { label: 'Saralanmoqda',       color: 'text-purple-500',  icon: RotateCcw },
  in_transit:   { label: 'Yo\'lda',            color: 'text-indigo-500',  icon: Truck },
  at_pickup:    { label: 'Qabul punktida',     color: 'text-teal-500',    icon: MapPin },
  delivered:    { label: 'Yetkazildi',         color: 'text-emerald-500', icon: CheckCircle },
  cancelled:    { label: 'Bekor qilindi',      color: 'text-red-500',     icon: RotateCcw },
}

const ALL_STATUSES = [
  { key: 'created',      step: 1 },
  { key: 'paid',         step: 2 },
  { key: 'preparing',    step: 3 },
  { key: 'at_warehouse', step: 4 },
  { key: 'sorting',      step: 5 },
  { key: 'in_transit',   step: 6 },
  { key: 'at_pickup',    step: 7 },
  { key: 'delivered',    step: 8 },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('overview')
  const [orderFilter, setOrderFilter] = useState('all')

  const user = {
    name: 'Jasur Toshmatov',
    email: 'jasur@example.com',
    phone: '+998 90 123-45-67',
    bonusPoints: 1250,
    totalOrders: 47,
    totalSpent: 128500000,
    memberSince: '2022-03-15',
    level: 'Gold',
  }

  const menuItems = [
    { key: 'overview',   icon: TrendingUp,  label: 'Umumiy',          badge: null },
    { key: 'orders',     icon: Package,     label: 'Buyurtmalarim',   badge: '3' },
    { key: 'wishlist',   icon: Heart,       label: 'Sevimlilar',      badge: '12' },
    { key: 'addresses',  icon: MapPin,      label: 'Manzillarim',     badge: null },
    { key: 'settings',   icon: Settings,    label: 'Sozlamalar',      badge: null },
  ]

  return (
    <div className="bg-surface-50 dark:bg-surface-950 min-h-screen py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Profile Card */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <Avatar name={user.name} size="xl" />
                  <button className="absolute bottom-0 right-0 h-6 w-6 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <Camera className="h-3 w-3 text-white" />
                  </button>
                </div>
                <h2 className="text-base font-bold text-surface-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-surface-400">{user.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-xs px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full font-bold flex items-center gap-1">
                    <Award className="h-3 w-3" /> {user.level} Member
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
                {[
                  { label: 'Buyurtma', value: user.totalOrders },
                  { label: 'Bonus', value: user.bonusPoints },
                  { label: 'Sharh', value: 12 },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-lg font-black text-surface-900 dark:text-white">{stat.value}</p>
                    <p className="text-[10px] text-surface-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Bonus Bar */}
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl border border-purple-100 dark:border-purple-900/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">💎 {user.bonusPoints} bonus ball</span>
                  <span className="text-xs text-surface-400">Keyingi daraja: 2000</span>
                </div>
                <div className="h-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${(user.bonusPoints / 2000) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-2">
              {menuItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key as any)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    activeTab === item.key
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', activeTab === item.key ? 'text-purple-600 dark:text-purple-400' : 'text-surface-400')} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="h-5 min-w-5 px-1.5 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
              <div className="border-t border-surface-100 dark:border-surface-800 mt-1 pt-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
                  <LogOut className="h-4 w-4" />
                  Chiqish
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-5">

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white">Salom, {user.name.split(' ')[0]}! 👋</h2>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: ShoppingBag, label: 'Jami buyurtma', value: user.totalOrders, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                    { icon: Zap, label: 'Faol buyurtma', value: 3, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
                    { icon: Award, label: 'Bonus ball', value: user.bonusPoints, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
                    { icon: Heart, label: 'Sevimli', value: 12, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10' },
                  ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-4">
                      <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center mb-2', s.bg)}>
                        <s.icon className={cn('h-5 w-5', s.color)} />
                      </div>
                      <p className="text-xl font-black text-surface-900 dark:text-white">{s.value}</p>
                      <p className="text-xs text-surface-400">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-surface-100 dark:border-surface-800">
                    <h3 className="font-semibold text-surface-900 dark:text-white">So'nggi buyurtmalar</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                      Barchasini ko'rish <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {orders.map(order => {
                    const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.created
                    const StatusIcon = status.icon
                    return (
                      <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors border-b border-surface-50 dark:border-surface-800 last:border-0">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800 flex-shrink-0">
                          <Image src={order.items[0].productImage} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-surface-900 dark:text-white">{order.orderNumber}</p>
                          <p className="text-xs text-surface-400">{order.items.length} ta mahsulot · {formatPrice(order.totalAmount)}</p>
                        </div>
                        <div className={cn('flex items-center gap-1 text-xs font-medium', status.color)}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Bonus Usage */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-purple-200 text-sm mb-1">Mavjud bonus balllar</p>
                      <p className="text-3xl font-black">{user.bonusPoints} ball</p>
                      <p className="text-purple-200 text-sm mt-1">≈ {formatPrice(user.bonusPoints * 100)} qiymatida</p>
                    </div>
                    <div className="text-4xl">💎</div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-colors">
                      Ballarni ishlatish
                    </button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors">
                      Tarix
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-5">Buyurtmalarim</h2>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
                  {[
                    { key: 'all', label: 'Barchasi' },
                    { key: 'active', label: 'Faollar' },
                    { key: 'delivered', label: 'Yetkazilgan' },
                    { key: 'cancelled', label: 'Bekor qilingan' },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setOrderFilter(f.key)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                        orderFilter === f.key
                          ? 'bg-purple-600 text-white'
                          : 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-purple-300'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {orders.map(order => {
                    const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.created
                    const StatusIcon = status.icon
                    const currentStep = ALL_STATUSES.find(s => s.key === order.status)?.step || 1

                    return (
                      <div key={order.id} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 overflow-hidden">
                        {/* Order Header */}
                        <div className="flex items-center justify-between p-4 border-b border-surface-50 dark:border-surface-800">
                          <div>
                            <p className="text-sm font-bold text-surface-900 dark:text-white">{order.orderNumber}</p>
                            <p className="text-xs text-surface-400">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={cn('flex items-center gap-1.5 text-sm font-semibold', status.color)}>
                              <StatusIcon className="h-4 w-4" />
                              {status.label}
                            </div>
                            <span className="text-sm font-bold text-surface-900 dark:text-white">{formatPrice(order.totalAmount)}</span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="px-4 py-3 bg-surface-50 dark:bg-surface-800/50">
                          <div className="flex items-center gap-1">
                            {ALL_STATUSES.map((s, i) => {
                              const sInfo = ORDER_STATUS_MAP[s.key]
                              const SIcon = sInfo?.icon || Clock
                              const isDone = s.step <= currentStep
                              const isCurrent = s.step === currentStep
                              return (
                                <div key={s.key} className="flex items-center flex-1 last:flex-none">
                                  <div className={cn(
                                    'h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                                    isCurrent ? 'bg-purple-600 text-white ring-2 ring-purple-300 dark:ring-purple-800' :
                                    isDone ? 'bg-emerald-500 text-white' :
                                    'bg-surface-200 dark:bg-surface-700 text-surface-400'
                                  )}>
                                    {isDone && !isCurrent ? <CheckCircle className="h-3.5 w-3.5" /> : <SIcon className="h-3 w-3" />}
                                  </div>
                                  {i < ALL_STATUSES.length - 1 && (
                                    <div className={cn('flex-1 h-0.5 mx-0.5', s.step < currentStep ? 'bg-emerald-400' : 'bg-surface-200 dark:bg-surface-700')} />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                          <p className="text-xs text-surface-500 mt-2 text-center">
                            {status.label} • Tracking: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                          </p>
                        </div>

                        {/* Items */}
                        <div className="p-4 space-y-3">
                          {order.items.map(item => (
                            <div key={item.id} className="flex gap-3 items-center">
                              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800 flex-shrink-0">
                                <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-1">{item.productName}</p>
                                <p className="text-xs text-surface-400">{item.quantity} ta × {formatPrice(item.price)}</p>
                              </div>
                              <div className="flex flex-col gap-1">
                                {order.status === 'delivered' && (
                                  <button className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                                    <Star className="h-3 w-3" /> Sharh
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 p-4 pt-0">
                          <Button variant="outline" size="sm">Tafsilotlar</Button>
                          {order.status === 'delivered' && <Button variant="outline" size="sm" leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>Qaytarish</Button>}
                          {order.status === 'in_transit' && <Button variant="outline" size="sm" leftIcon={<Truck className="h-3.5 w-3.5" />}>Kuzatish</Button>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-5">Sevimlilar (12)</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 overflow-hidden group">
                      <div className="relative aspect-square bg-surface-50 dark:bg-surface-800">
                        <div className="absolute inset-0 shimmer" />
                        <button className="absolute top-2 right-2 h-8 w-8 bg-white dark:bg-surface-700 rounded-xl flex items-center justify-center shadow-sm text-red-500">
                          <Heart className="h-4 w-4 fill-red-500" />
                        </button>
                      </div>
                      <div className="p-3">
                        <div className="h-3 w-3/4 shimmer rounded mb-2" />
                        <div className="h-4 w-1/2 shimmer rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-5">Manzillarim</h2>
                <div className="space-y-3">
                  {[
                    { label: '🏠 Uy', address: 'Toshkent, Yunusobod tumani, Amir Temur ko\'chasi 108, 12-xonadon', isDefault: true },
                    { label: '🏢 Ofis', address: 'Toshkent, Mirzo Ulugbek tumani, Bunyodkor shoh. 54', isDefault: false },
                  ].map((addr, i) => (
                    <div key={i} className={cn(
                      'flex items-start gap-4 p-4 bg-white dark:bg-surface-900 rounded-2xl border-2 transition-all',
                      addr.isDefault ? 'border-purple-200 dark:border-purple-800' : 'border-surface-100 dark:border-surface-800'
                    )}>
                      <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-surface-900 dark:text-white">{addr.label}</p>
                          {addr.isDefault && <Badge variant="purple" size="sm">Asosiy</Badge>}
                        </div>
                        <p className="text-sm text-surface-500">{addr.address}</p>
                      </div>
                      <button className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button className="w-full p-4 rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-700 hover:border-purple-300 flex items-center justify-center gap-2 text-sm text-surface-500 hover:text-purple-600 transition-all">
                    <MapPin className="h-4 w-4" />
                    Yangi manzil qo'shish
                  </button>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in space-y-5">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white">Sozlamalar</h2>
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 divide-y divide-surface-100 dark:divide-surface-800 overflow-hidden">
                  {[
                    { label: 'Ism va familiya', value: 'Jasur Toshmatov' },
                    { label: 'Email', value: 'jasur@example.com' },
                    { label: 'Telefon', value: '+998 90 123-45-67' },
                    { label: 'Parol', value: '••••••••' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-xs text-surface-400 mb-0.5">{item.label}</p>
                        <p className="text-sm font-medium text-surface-900 dark:text-white">{item.value}</p>
                      </div>
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                        <Edit2 className="h-3.5 w-3.5" /> O'zgartirish
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Bildirishnomalar</h3>
                  {[
                    { label: 'Buyurtma yangilanishlari', checked: true },
                    { label: 'Chegirma va aksiyalar', checked: true },
                    { label: 'Sevimli mahsulotlar', checked: false },
                    { label: 'Email xabarlar', checked: true },
                  ].map((n, i) => (
                    <label key={i} className="flex items-center justify-between py-2.5 cursor-pointer">
                      <span className="text-sm text-surface-700 dark:text-surface-300">{n.label}</span>
                      <div className={cn('relative h-5 w-9 rounded-full transition-colors', n.checked ? 'bg-purple-600' : 'bg-surface-200 dark:bg-surface-700')}>
                        <div className={cn('absolute top-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform', n.checked ? 'translate-x-4' : 'translate-x-0.5')} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
