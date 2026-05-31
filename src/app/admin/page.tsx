'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  DollarSign, Users, Store, ShoppingBag, Package, TrendingUp,
  TrendingDown, ArrowUpRight, CheckCircle, Clock, AlertCircle,
  XCircle, Eye, Shield, Zap, Activity, Globe, Star
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import { chartData, topProducts, orders } from '@/lib/mockData'
import StatsCard from '@/components/ui/StatsCard'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'

const COLORS = ['#9333ea', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

const regionData = [
  { name: 'Toshkent',      value: 38, orders: 6924 },
  { name: 'Samarqand',     value: 14, orders: 2548 },
  { name: 'Farg\'ona',     value: 12, orders: 2184 },
  { name: 'Andijon',       value: 10, orders: 1820 },
  { name: 'Namangan',      value: 8,  orders: 1456 },
  { name: 'Boshqalar',     value: 18, orders: 3278 },
]

const deviceData = [
  { name: 'Mobile', value: 64 },
  { name: 'Desktop', value: 28 },
  { name: 'Tablet', value: 8 },
]

const recentActivity = [
  { type: 'seller', icon: Store,    color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-900/10',    msg: 'TechZone UZ ro\'yxatdan o\'tdi',        time: '5 daqiqa oldin' },
  { type: 'order',  icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10', msg: 'Yangi buyurtma: ORD-2024-001249',      time: '8 daqiqa oldin' },
  { type: 'alert',  icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10', msg: '5 ta mahsulot moderatsiyada',          time: '12 daqiqa oldin' },
  { type: 'user',   icon: Users,    color: 'text-emerald-500',  bg: 'bg-emerald-50 dark:bg-emerald-900/10', msg: '47 ta yangi foydalanuvchi (bugun)',  time: '1 soat oldin' },
  { type: 'payment',icon: DollarSign,color:'text-yellow-500',   bg: 'bg-yellow-50 dark:bg-yellow-900/10', msg: 'To\'lov: 14 500 000 so\'m qabul qilindi', time: '2 soat oldin' },
]

const pendingSellers = [
  { name: 'Fashion Store UZ', category: 'Kiyim',     products: 45,  rating: null,  date: '2024-01-22' },
  { name: 'GadgetHub',       category: 'Elektronika', products: 120, rating: null,  date: '2024-01-21' },
  { name: 'HomeDecor Pro',   category: 'Mebel',       products: 67,  rating: null,  date: '2024-01-20' },
]

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | '90d'>('30d')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Super Admin Dashboard</h1>
          <p className="text-surface-500 text-sm mt-0.5 flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse-soft" />
            Real-time ma'lumotlar · Oxirgi yangilanish: 1 daqiqa oldin
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['today', '7d', '30d', '90d'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                period === p ? 'bg-purple-600 text-white' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 hover:border-purple-300'
              )}
            >
              {p === 'today' ? 'Bugun' : p === '7d' ? '7 kun' : p === '30d' ? '30 kun' : '90 kun'}
            </button>
          ))}
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800', title: '12 ta tasdiqlash kutmoqda', sub: '8 seller, 4 mahsulot', href: '/admin/sellers' },
          { icon: Shield,      color: 'text-red-600',    bg: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800',          title: '5 ta shikoyat',             sub: 'Ko\'rib chiqish kerak',    href: '/admin/reports' },
          { icon: Activity,    color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800',       title: 'Tizim holati: 99.9%',       sub: 'Barcha tizimlar ishlamoqda', href: '/admin/settings' },
        ].map(alert => (
          <div key={alert.title} className={cn('flex items-center gap-3 p-4 rounded-2xl border', alert.bg)}>
            <alert.icon className={cn('h-5 w-5 shrink-0', alert.color)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">{alert.title}</p>
              <p className="text-xs text-surface-500">{alert.sub}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-surface-400 shrink-0" />
          </div>
        ))}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Umumiy aylanma"
          value="2 847 500 000"
          change={23.5}
          icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          iconBg="bg-purple-100 dark:bg-purple-900/20"
        />
        <StatsCard
          title="Foydalanuvchilar"
          value="142 500"
          change={31.4}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-100 dark:bg-blue-900/20"
        />
        <StatsCard
          title="Sotuvchilar"
          value="8 524"
          change={18.2}
          icon={<Store className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/20"
        />
        <StatsCard
          title="Buyurtmalar"
          value="18 429"
          change={15.7}
          icon={<ShoppingBag className="h-5 w-5 text-orange-600" />}
          iconBg="bg-orange-100 dark:bg-orange-900/20"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Komissiya daromad', value: '341 700 000', change: '+12%', color: 'text-purple-600' },
          { label: 'O\'rtacha buyurtma', value: '154 500',     change: '+5%',  color: 'text-blue-600' },
          { label: 'Konversiya',        value: '3.8%',         change: '+0.3%',color: 'text-emerald-600' },
          { label: 'Qaytarishlar',      value: '2.1%',         change: '-0.2%',color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-4">
            <p className="text-xs text-surface-400 mb-1">{s.label}</p>
            <p className={cn('text-xl font-black', s.color)}>{s.value}</p>
            <p className="text-xs text-surface-400 mt-0.5">{s.change} o'tgan oyga</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2" padding="lg">
          <CardHeader>
            <CardTitle>Platform daromadi (so'm)</CardTitle>
            <div className="flex items-center gap-3">
              {[
                { color: '#9333ea', label: 'Daromad' },
                { color: '#10b981', label: 'Komissiya' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-surface-400">
                  <div className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </CardHeader>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: number, name: string) => [formatPrice(v), name === 'revenue' ? 'Daromad' : 'Komissiya']} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2} fill="url(#adminRevGrad)" />
              <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} fill="url(#commGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Region Pie */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Mintaqalar</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={regionData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                {regionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, name, p) => [`${v}%`, p.payload.name]} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
            {regionData.map((r, i) => (
              <div key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-xs text-surface-600 dark:text-surface-400">{r.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-surface-900 dark:text-white">{r.value}%</span>
                  <span className="text-surface-400">{r.orders.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Orders bar */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Buyurtmalar dinamikasi</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="orders" fill="#9333ea" radius={[6,6,0,0]} name="Buyurtmalar" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Device */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Qurilma taqsimoti</CardTitle>
          </CardHeader>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {deviceData.map((_, i) => <Cell key={i} fill={['#9333ea','#3b82f6','#10b981'][i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {deviceData.map((d, i) => (
                <div key={d.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-surface-600 dark:text-surface-400 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: ['#9333ea','#3b82f6','#10b981'][i] }} />
                      {d.name}
                    </span>
                    <span className="font-bold text-surface-900 dark:text-white">{d.value}%</span>
                  </div>
                  <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: ['#9333ea','#3b82f6','#10b981'][i] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pending Sellers */}
        <Card className="lg:col-span-2" padding="none">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle>Tasdiqlash kutayotgan sellerlar</CardTitle>
            <Badge variant="warning">{pendingSellers.length} ta</Badge>
          </CardHeader>
          <div className="mt-4">
            {pendingSellers.map((s, i) => (
              <div key={s.name} className={cn('flex items-center gap-3 px-5 py-3.5', i < pendingSellers.length - 1 && 'border-b border-surface-50 dark:border-surface-800')}>
                <Avatar name={s.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{s.name}</p>
                  <p className="text-xs text-surface-400">{s.category} · {s.products} mahsulot</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-7 w-7 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors">
                    <XCircle className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-4 pt-2">
            <button className="w-full py-2 text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center justify-center gap-1">
              Barchasini ko'rish <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-3" padding="none">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle>So'nggi faoliyat</CardTitle>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse-soft" />
              Real-time
            </span>
          </CardHeader>
          <div className="mt-4">
            {recentActivity.map((act, i) => (
              <div key={i} className={cn('flex items-start gap-3 px-5 py-3.5', i < recentActivity.length - 1 && 'border-b border-surface-50 dark:border-surface-800')}>
                <div className={cn('h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0', act.bg)}>
                  <act.icon className={cn('h-4 w-4', act.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{act.msg}</p>
                  <p className="text-xs text-surface-400 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />{act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Products Platform-wide */}
      <Card padding="none">
        <CardHeader className="px-5 pt-5 pb-0">
          <CardTitle>Platform bo'yicha top mahsulotlar</CardTitle>
          <button className="text-xs font-medium text-purple-600 flex items-center gap-1">
            Barchasini ko'rish <ArrowUpRight className="h-3 w-3" />
          </button>
        </CardHeader>
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                {['#', 'Mahsulot', 'Seller', 'Sotildi', 'Daromad', 'Reyting', 'Holat'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {topProducts.map((p, i) => (
                <tr key={p.id} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                  <td className="py-3 px-4">
                    <span className={cn('text-sm font-black', i === 0 ? 'text-yellow-500' : i === 1 ? 'text-surface-400' : i === 2 ? 'text-orange-400' : 'text-surface-300')}>{i + 1}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800 flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <span className="text-sm font-medium text-surface-900 dark:text-white line-clamp-1 max-w-[160px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className="text-sm text-surface-500">TechZone UZ</span></td>
                  <td className="py-3 px-4"><span className="text-sm font-semibold text-surface-900 dark:text-white">{p.sales.toLocaleString()} ta</span></td>
                  <td className="py-3 px-4"><span className="text-sm font-bold text-purple-600 dark:text-purple-400">{(p.revenue / 1000000000).toFixed(1)}B</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-surface-900 dark:text-white">4.{7 + i % 3}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><Badge variant="success" size="sm">Faol</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
