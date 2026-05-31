'use client'

import { useState } from 'react'
import {
  Search, MapPin, Package, Truck, CheckCircle, Clock,
  CreditCard, Shield, RefreshCw, ScanLine, ChevronRight, QrCode
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { orders } from '@/lib/mockData'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const ALL_STATUSES = [
  { key: 'created',      label: 'Buyurtma yaratildi',       icon: Package,      desc: 'Buyurtma tizimga qabul qilindi' },
  { key: 'paid',         label: "To'lov qabul qilindi",     icon: CreditCard,   desc: 'To\'lov muvaffaqiyatli o\'tkazildi' },
  { key: 'preparing',    label: 'Sotuvchi tayyorlamoqda',   icon: RefreshCw,    desc: 'Sotuvchi mahsulotni tayyorlamoqda' },
  { key: 'at_warehouse', label: 'Omborga topshirildi',      icon: Shield,       desc: 'Market.uz omboriga qabul qilindi' },
  { key: 'sorting',      label: 'Saralanmoqda',             icon: ScanLine,     desc: 'Paket saralash markazida' },
  { key: 'in_transit',   label: "Yo'lda",                   icon: Truck,        desc: 'Kuryerga topshirildi, yo\'lda' },
  { key: 'at_pickup',    label: 'Qabul punktiga yetdi',     icon: MapPin,       desc: 'Yaqin qabul punktingizga yetdi' },
  { key: 'delivered',    label: 'Xaridorga topshirildi',    icon: CheckCircle,  desc: 'Buyurtma muvaffaqiyatli topshirildi' },
]

export default function TrackingPage() {
  const [trackInput, setTrackInput] = useState('')
  const [tracked, setTracked] = useState<typeof orders[0] | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleTrack = () => {
    const found = orders.find(o =>
      o.orderNumber === trackInput ||
      o.trackingNumber === trackInput ||
      trackInput === 'TRK-2024-89742'
    )
    if (found) { setTracked(found); setNotFound(false) }
    else if (trackInput) { setTracked(null); setNotFound(true) }
  }

  const currentStepIndex = tracked
    ? ALL_STATUSES.findIndex(s => s.key === tracked.status)
    : -1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Buyurtma kuzatish</h1>
        <p className="text-sm text-surface-500 mt-0.5">Buyurtma raqami yoki tracking ID orqali kuzating</p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-6">
        <div className="flex gap-3">
          <Input
            value={trackInput}
            onChange={e => setTrackInput(e.target.value)}
            placeholder="ORD-2024-001247 yoki TRK-2024-89742"
            leftIcon={<Search className="h-4 w-4" />}
            inputSize="lg"
            className="flex-1"
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
          />
          <Button size="lg" onClick={handleTrack}>Kuzatish</Button>
          <Button variant="outline" size="lg" leftIcon={<QrCode className="h-5 w-5" />} className="hidden sm:flex">
            QR
          </Button>
        </div>
        <p className="text-xs text-surface-400 mt-2">
          Test: <button onClick={() => setTrackInput('TRK-2024-89742')} className="text-purple-600 underline">TRK-2024-89742</button> ni kiriting
        </p>
      </div>

      {/* Not found */}
      {notFound && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl animate-fade-in">
          <Package className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">Buyurtma topilmadi. Raqamni tekshirib qaytadan urinib ko'ring.</p>
        </div>
      )}

      {/* Tracking Result */}
      {tracked && (
        <div className="space-y-5 animate-fade-in">
          {/* Order Info */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs text-surface-400 mb-1">Buyurtma raqami</p>
                <p className="text-xl font-black text-surface-900 dark:text-white font-mono">{tracked.orderNumber}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={tracked.status === 'delivered' ? 'success' : 'purple'}>
                    {ALL_STATUSES.find(s => s.key === tracked.status)?.label || tracked.status}
                  </Badge>
                  <span className="text-xs text-surface-400">Tracking: <span className="font-mono font-semibold">{tracked.trackingNumber}</span></span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-surface-400">Buyurtma summasi</p>
                <p className="text-2xl font-black text-surface-900 dark:text-white">{formatPrice(tracked.totalAmount)}</p>
                <p className="text-xs text-surface-400">{tracked.items.length} ta mahsulot</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <MapPin className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-surface-500 mb-0.5">YETKAZIB BERISH MANZILI</p>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{tracked.shippingAddress.fullName}</p>
                <p className="text-sm text-surface-500">{tracked.shippingAddress.street}, {tracked.shippingAddress.city}</p>
                <p className="text-xs text-surface-400">{tracked.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
            <h2 className="text-base font-bold text-surface-900 dark:text-white mb-6">Buyurtma holati</h2>

            {/* Horizontal Progress (desktop) */}
            <div className="hidden md:flex items-center mb-8 overflow-x-auto pb-2">
              {ALL_STATUSES.map((status, i) => {
                const isDone = i <= currentStepIndex
                const isCurrent = i === currentStepIndex
                const Icon = status.icon
                return (
                  <div key={status.key} className="flex items-center flex-1 last:flex-none min-w-[80px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className={cn(
                        'h-10 w-10 rounded-2xl flex items-center justify-center transition-all',
                        isCurrent ? 'bg-purple-600 text-white shadow-purple ring-4 ring-purple-200 dark:ring-purple-900' :
                        isDone ? 'bg-emerald-500 text-white' :
                        'bg-surface-100 dark:bg-surface-800 text-surface-400'
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={cn('text-[10px] font-medium text-center leading-tight max-w-[70px]',
                        isCurrent ? 'text-purple-600 dark:text-purple-400' :
                        isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400'
                      )}>
                        {status.label}
                      </span>
                    </div>
                    {i < ALL_STATUSES.length - 1 && (
                      <div className={cn('flex-1 h-0.5 mx-1 mt-[-12px]', i < currentStepIndex ? 'bg-emerald-400' : 'bg-surface-200 dark:bg-surface-700')} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Vertical Timeline (mobile + detail) */}
            <div className="space-y-0">
              {ALL_STATUSES.map((status, i) => {
                const isDone = i <= currentStepIndex
                const isCurrent = i === currentStepIndex
                const Icon = status.icon
                const historyEntry = tracked.statusHistory?.find(h => h.status === status.key)

                return (
                  <div key={status.key} className="flex gap-4">
                    {/* Line */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 z-10 transition-all',
                        isCurrent ? 'bg-purple-600 text-white shadow-purple' :
                        isDone ? 'bg-emerald-500 text-white' :
                        'bg-surface-100 dark:bg-surface-800 text-surface-300'
                      )}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      {i < ALL_STATUSES.length - 1 && (
                        <div className={cn('w-0.5 flex-1 my-1 min-h-[20px]', i < currentStepIndex ? 'bg-emerald-400' : 'bg-surface-100 dark:bg-surface-800')} />
                      )}
                    </div>
                    {/* Content */}
                    <div className={cn('pb-4 flex-1', i === ALL_STATUSES.length - 1 && 'pb-0')}>
                      <div className="flex items-center justify-between">
                        <p className={cn('text-sm font-semibold',
                          isCurrent ? 'text-purple-600 dark:text-purple-400' :
                          isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400'
                        )}>
                          {status.label}
                        </p>
                        {historyEntry && (
                          <span className="text-xs text-surface-400">{new Date(historyEntry.timestamp).toLocaleString('uz-UZ')}</span>
                        )}
                      </div>
                      <p className={cn('text-xs mt-0.5', isDone ? 'text-surface-500' : 'text-surface-300')}>
                        {historyEntry?.note || status.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Buyurtma tarkibi</h3>
            {tracked.items.map(item => (
              <div key={item.id} className="flex gap-3 items-center py-2">
                <div className="h-12 w-12 rounded-xl bg-surface-100 dark:bg-surface-800 overflow-hidden flex-shrink-0">
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-surface-400">{item.quantity} ta · {item.sellerName}</p>
                </div>
                <p className="text-sm font-bold text-surface-900 dark:text-white whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
