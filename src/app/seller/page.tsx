'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  TrendingUp, TrendingDown, Package, ShoppingBag, DollarSign,
  Users, Eye, Star, ArrowUpRight, Clock, CheckCircle, Truck,
  AlertCircle, BarChart3, RefreshCw, Zap
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { chartData, topProducts, orders } from '@/lib/mockData'
import StatsCard from '@/components/ui/StatsCard'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const COLORS = ['#9333ea', '#10b981', '#3b82f6', '#f59e0b', '#ef4444']

const categoryData = [
  { name: 'Smartfonlar', value: 42 },
  { name: 'Noutbuklar', value: 28 },
  { name: 'Audio', value: 18 },
  { name: 'Boshqalar', value: 12 },
]

export default function SellerDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  const recentOrders = [
    { id: 'ORD-001', customer: 'Jasur T.', product: 'iPhone 15 Pro', amount: 14500000, status: 'in_transit', time: '2 soat oldin' },
    { id: 'ORD-002', customer: 'Malika Y.', product: 'AirPods Pro', amount: 1890000, status: 'preparing', time: '4 soat oldin' },
    { id: 'ORD-003', customer: 'Bobur K.', product: 'MacBook Air M3', amount: 19500000, status: 'paid', time: '6 soat oldin' },
    { id: 'ORD-004', customer: 'Dildora N.', product: 'Samsung S24', amount: 12800000, status: 'delivered', time: '1 kun oldin' },
    { id: 'ORD-005', customer: 'Sherzod R.', product: 'Sony WH-1000XM5', amount: 2890000, status: 'delivered', time: '1 kun oldin' },
  ]

  const statusMap: Record<string, { label: string; variant: any }> = {
    created:   { label: 'Yaratildi',     variant: 'default' },
    paid:      { label: 'To\'langan',    variant: 'info' },
    preparing: { label: 'Tayyorlanmoqda', variant: 'warning' },
    in_transit:{ label: 'Yo\'lda',       variant: 'purple' },
    delivered: { label: 'Yetkazildi',    variant: 'success' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
          <p className="text-surface-500 text-sm mt-0.5">Xush kelibsiz, TechZone UZ! 👋</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-sm font-medium transition-all',
                period === p ? 'bg-purple-600 text-white' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 hover:border-purple-300'
              )}
            >
              {p === '7d' ? '7 kun' : p === '30d' ? '30 kun' : '90 kun'}
            </button>
          ))}
        </div>
      </div>

      {/* Alert */}
      <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl">
        <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          <span className="font-semibold">5 ta mahsulot</span> zaxirasi tugash arafasida. 
          <button className="ml-2 underline font-semibold">Ko'rish</button>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Oylik daromad"
          value="284 750 000 so'm"
          change={23.5}
          icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          iconBg="bg-purple-100 dark:bg-purple-900/20"
        />
        <StatsCard
          title="Buyurtmalar"
          value="1 247"
          change={18.2}
          icon={<ShoppingBag className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-100 dark:bg-blue-900/20"
        />
        <StatsCard
          title="Mahsulotlar"
          value="342"
          change={5.1}
          icon={<Package className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/20"
        />
        <StatsCard
          title="Mijozlar"
          value="8 924"
          change={31.4}
          icon={<Users className="h-5 w-5 text-orange-600" />}
          iconBg="bg-orange-100 dark:bg-orange-900/20"
        />
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Bugungi savdo', value: '12 450 000', sub: '+8 ta buyurtma', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
          { label: 'Kutayotgan to\'lov', value: '8 200 000', sub: '3 kun ichida', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'O\'rtacha reyting', value: '4.8 / 5.0', sub: '1,247 sharh', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
          { label: 'Konversiya', value: '4.2%', sub: '+0.3% o\'sdi', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
        ].map(s => (
          <div key={s.label} className={cn('rounded-2xl p-4 border border-transparent', s.bg)}>
            <p className="text-xs font-medium text-surface-500 mb-1">{s.label}</p>
            <p className={cn('text-lg font-black', s.color)}>{s.value}</p>
            <p className="text-xs text-surface-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2" padding="lg">
          <CardHeader>
            <CardTitle>Daromad dinamikasi</CardTitle>
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">+23.5%</span>
              <span>o'tgan oyga nisbatan</span>
            </div>
          </CardHeader>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip
                formatter={(v: number) => [formatPrice(v), 'Daromad']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2.5} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Pie */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Kategoriyalar</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} formatter={(v) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-xs text-surface-600 dark:text-surface-400">{cat.name}</span>
                </div>
                <span className="text-xs font-semibold text-surface-900 dark:text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent Orders */}
        <Card className="lg:col-span-3" padding="none">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle>So'nggi buyurtmalar</CardTitle>
            <button className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
              Barchasini ko'rish <ArrowUpRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <div className="mt-4">
            {recentOrders.map((order, i) => {
              const st = statusMap[order.status] || statusMap.created
              return (
                <div key={order.id} className={cn('flex items-center gap-4 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors', i < recentOrders.length - 1 && 'border-b border-surface-50 dark:border-surface-800')}>
                  <div className="h-9 w-9 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono text-surface-500">{order.id}</p>
                      <p className="text-xs font-semibold text-surface-900 dark:text-white truncate">{order.customer}</p>
                    </div>
                    <p className="text-xs text-surface-400 truncate">{order.product}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-surface-900 dark:text-white">{formatPrice(order.amount)}</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <Badge variant={st.variant} size="sm">{st.label}</Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-2" padding="none">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle>Top mahsulotlar</CardTitle>
          </CardHeader>
          <div className="mt-4">
            {topProducts.slice(0, 5).map((p, i) => (
              <div key={p.id} className={cn('flex items-center gap-3 px-5 py-3 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors', i < 4 && 'border-b border-surface-50 dark:border-surface-800')}>
                <span className={cn('text-xs font-black w-4 text-center', i === 0 ? 'text-yellow-500' : i === 1 ? 'text-surface-400' : i === 2 ? 'text-orange-400' : 'text-surface-300')}>
                  {i + 1}
                </span>
                <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800 flex-shrink-0">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-surface-900 dark:text-white line-clamp-1">{p.name}</p>
                  <p className="text-[11px] text-surface-400">{p.sales} ta sotildi</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-surface-900 dark:text-white">{formatNumber(p.revenue / 1000000)}M</p>
                  <p className="text-[10px] text-surface-400">zaxira: {p.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Orders Bar Chart */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Haftalik buyurtmalar</CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span className="text-surface-500">Daromad</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-surface-500">Buyurtmalar</span>
            </div>
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData.slice(0, 8)} barSize={24} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
            <Bar yAxisId="left" dataKey="revenue" fill="#9333ea" radius={[6, 6, 0, 0]} name="Daromad" />
            <Bar yAxisId="right" dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} name="Buyurtmalar" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
