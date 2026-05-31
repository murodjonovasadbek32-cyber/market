'use client'

import { useState, useEffect } from 'react'
import {
  Package, Truck, CheckCircle, Clock, AlertCircle, ScanLine,
  TrendingUp, ArrowUpRight, BarChart3, MapPin, Zap, RefreshCw
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { cn, formatPrice } from '@/lib/utils'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import StatsCard from '@/components/ui/StatsCard'

const hourlyData = [
  { time: '08:00', received: 12, dispatched: 8, delivered: 5 },
  { time: '09:00', received: 24, dispatched: 18, delivered: 14 },
  { time: '10:00', received: 31, dispatched: 27, delivered: 22 },
  { time: '11:00', received: 19, dispatched: 23, delivered: 30 },
  { time: '12:00', received: 8,  dispatched: 14, delivered: 18 },
  { time: '13:00', received: 15, dispatched: 20, delivered: 25 },
  { time: '14:00', received: 28, dispatched: 31, delivered: 19 },
  { time: '15:00', received: 35, dispatched: 28, delivered: 22 },
]


const recentScans = [
  { id: 'PKG-001247', product: 'iPhone 15 Pro Max', seller: 'TechZone UZ', status: 'received', time: '14:32', zone: 'A-12' },
  { id: 'PKG-001246', product: 'Samsung Galaxy S24', seller: 'TechZone UZ', status: 'sorting', time: '14:28', zone: 'B-05' },
  { id: 'PKG-001245', product: 'Nike Air Max 270', seller: 'SportMax UZ', status: 'dispatched', time: '14:15', zone: 'C-08' },
  { id: 'PKG-001244', product: 'Sony WH-1000XM5', seller: 'AudioWorld', status: 'delivered', time: '13:55', zone: '—' },
  { id: 'PKG-001243', product: 'MacBook Air M3', seller: 'Apple Store UZ', status: 'received', time: '13:40', zone: 'A-07' },
]

const zoneStatus = [
  { zone: 'A', name: 'Qabul qilish', capacity: 200, used: 142, color: 'bg-blue-500' },
  { zone: 'B', name: 'Saralash', capacity: 150, used: 89, color: 'bg-purple-500' },
  { zone: 'C', name: 'Jo\'natish', capacity: 100, used: 67, color: 'bg-orange-500' },
  { zone: 'D', name: 'Qaytarishlar', capacity: 50, used: 12, color: 'bg-red-500' },
]

const statusMap: Record<string, { label: string; variant: any; color: string }> = {
  received:   { label: 'Qabul qilindi', variant: 'info',    color: 'text-blue-500' },
  sorting:    { label: 'Saralanmoqda',  variant: 'warning', color: 'text-yellow-500' },
  dispatched: { label: 'Jo\'natildi',   variant: 'purple',  color: 'text-purple-500' },
  delivered:  { label: 'Yetkazildi',    variant: 'success', color: 'text-emerald-500' },
}


export default function LogisticsDashboard() {
  const [liveCount, setLiveCount] = useState(247)

  useEffect(() => {
    const t = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 3)), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Ombor Dashboard</h1>
          <p className="text-sm text-surface-500 mt-0.5 flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse-soft" />
            Real-time kuzatuv · Warehouse #1 · Toshkent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Bugungi paket</p>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">{liveCount}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Kutayotganlar" value="142" change={12.4}
          icon={<Package className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-100 dark:bg-blue-900/20" />
        <StatsCard title="Saralanmoqda" value="89" change={-3.2}
          icon={<RefreshCw className="h-5 w-5 text-purple-600" />}
          iconBg="bg-purple-100 dark:bg-purple-900/20" />
        <StatsCard title="Yo'lda" value="67" change={8.7}
          icon={<Truck className="h-5 w-5 text-orange-600" />}
          iconBg="bg-orange-100 dark:bg-orange-900/20" />
        <StatsCard title="Yetkazildi (bugun)" value="318" change={22.1}
          icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/20" />
      </div>

      {/* Zone Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {zoneStatus.map(z => (
          <div key={z.zone} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={cn('h-8 w-8 rounded-xl flex items-center justify-center text-white font-black text-sm', z.color.replace('bg-', 'bg-').replace('-500', '-500'))}>
                {z.zone}
              </div>
              <span className="text-xs text-surface-400">{z.used}/{z.capacity}</span>
            </div>
            <p className="text-sm font-semibold text-surface-900 dark:text-white mb-2">{z.name}</p>
            <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full transition-all', z.color)} style={{ width: `${(z.used / z.capacity) * 100}%` }} />
            </div>
            <p className="text-xs text-surface-400 mt-1">{Math.round((z.used / z.capacity) * 100)}% to'lgan</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Soatlik harakat</CardTitle>
            <div className="flex gap-3">
              {[
                { color: '#3b82f6', label: 'Qabul' },
                { color: '#9333ea', label: 'Jo\'natish' },
                { color: '#10b981', label: 'Yetkazish' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1 text-xs text-surface-400">
                  <div className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyData}>
              <defs>
                {[
                  { id: 'recv', color: '#3b82f6' },
                  { id: 'disp', color: '#9333ea' },
                  { id: 'delv', color: '#10b981' },
                ].map(g => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={g.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="received" stroke="#3b82f6" strokeWidth={2} fill="url(#recv)" name="Qabul" />
              <Area type="monotone" dataKey="dispatched" stroke="#9333ea" strokeWidth={2} fill="url(#disp)" name="Jo'natish" />
              <Area type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} fill="url(#delv)" name="Yetkazish" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>Paketlar holati</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData} barSize={18} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="received"   fill="#3b82f6" radius={[4,4,0,0]} name="Qabul" />
              <Bar dataKey="dispatched" fill="#9333ea" radius={[4,4,0,0]} name="Jo'natish" />
              <Bar dataKey="delivered"  fill="#10b981" radius={[4,4,0,0]} name="Yetkazish" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card padding="none">
        <CardHeader className="px-5 pt-5 pb-0">
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-emerald-500" />
            So'nggi skanerlar
          </CardTitle>
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse-soft" /> Live
          </span>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                {['Paket ID', 'Mahsulot', 'Seller', 'Zona', 'Vaqt', 'Holat'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {recentScans.map(scan => {
                const st = statusMap[scan.status]
                return (
                  <tr key={scan.id} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono font-semibold text-surface-900 dark:text-white">{scan.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-surface-700 dark:text-surface-300 line-clamp-1 max-w-[160px]">{scan.product}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-surface-500">{scan.seller}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono font-bold text-surface-900 dark:text-white">{scan.zone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-surface-500">{scan.time}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={st.variant} size="sm">{st.label}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
