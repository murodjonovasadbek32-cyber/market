'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Search, CheckCircle, XCircle, Eye, Edit2, Trash2,
  Store, Star, Package, ShoppingBag, TrendingUp, Filter,
  Download, Plus, Clock, AlertCircle, ArrowUpRight
} from 'lucide-react'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import toast from 'react-hot-toast'

const sellers = [
  { id: 's1', name: 'TechZone UZ', category: 'Elektronika', products: 342, orders: 8924, revenue: 284750000, rating: 4.8, status: 'approved', commission: 8, joined: '2023-01-15', avatar: null },
  { id: 's2', name: 'Fashion Hub', category: 'Kiyim', products: 1240, orders: 12450, revenue: 187200000, rating: 4.6, status: 'approved', commission: 10, joined: '2023-03-22', avatar: null },
  { id: 's3', name: 'SportWorld UZ', category: 'Sport', products: 567, orders: 5670, revenue: 124500000, rating: 4.7, status: 'approved', commission: 9, joined: '2023-06-10', avatar: null },
  { id: 's4', name: 'HomeStyle Pro', category: 'Mebel', products: 234, orders: 2100, revenue: 98400000, rating: 4.5, status: 'pending', commission: 12, joined: '2024-01-18', avatar: null },
  { id: 's5', name: 'Beauty Corner', category: 'Go\'zallik', products: 890, orders: 7800, revenue: 156000000, rating: 4.9, status: 'approved', commission: 7, joined: '2023-08-05', avatar: null },
  { id: 's6', name: 'GadgetHub', category: 'Elektronika', products: 120, orders: 0, revenue: 0, rating: null, status: 'pending', commission: 8, joined: '2024-01-21', avatar: null },
  { id: 's7', name: 'KidsWorld', category: 'Bolalar', products: 45, orders: 320, revenue: 12400000, rating: 4.3, status: 'suspended', commission: 10, joined: '2023-11-12', avatar: null },
]

export default function AdminSellersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSeller, setSelectedSeller] = useState<typeof sellers[0] | null>(null)

  const filtered = sellers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const approve = (id: string) => {
    toast.success('✅ Seller tasdiqlandi!')
  }
  const suspend = (id: string) => {
    toast.error('⛔ Seller to\'xtatildi')
  }

  const statusMap: Record<string, { label: string; variant: any }> = {
    approved:  { label: 'Tasdiqlangan', variant: 'success' },
    pending:   { label: 'Kutmoqda',     variant: 'warning' },
    suspended: { label: 'To\'xtatildi', variant: 'error' },
    rejected:  { label: 'Rad etildi',   variant: 'error' },
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Sotuvchilar</h1>
          <p className="text-sm text-surface-500">{sellers.length} ta sotuvchi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Export</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Jami sellerlar', value: sellers.length, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
          { label: 'Tasdiqlangan', value: sellers.filter(s => s.status === 'approved').length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Kutmoqda', value: sellers.filter(s => s.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
          { label: 'To\'xtatilgan', value: sellers.filter(s => s.status === 'suspended').length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10' },
        ].map(s => (
          <div key={s.label} className={cn('rounded-2xl p-4 border border-transparent', s.bg)}>
            <p className={cn('text-3xl font-black', s.color)}>{s.value}</p>
            <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Seller nomi..." leftIcon={<Search className="h-4 w-4" />} className="flex-1" />
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'approved', 'pending', 'suspended'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn('px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', statusFilter === f ? 'bg-purple-600 text-white' : 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400')}
            >
              {f === 'all' ? 'Barchasi' : f === 'approved' ? 'Tasdiqlangan' : f === 'pending' ? 'Kutmoqda' : 'To\'xtatilgan'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                {['Seller', 'Kategoriya', 'Mahsulot', 'Buyurtma', 'Daromad', 'Reyting', 'Komissiya', 'Holat', 'Amal'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {filtered.map(seller => {
                const st = statusMap[seller.status]
                return (
                  <tr key={seller.id} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={seller.name} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-surface-900 dark:text-white">{seller.name}</p>
                          <p className="text-xs text-surface-400">{formatDate(seller.joined)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className="text-sm text-surface-600 dark:text-surface-400">{seller.category}</span></td>
                    <td className="py-3 px-4"><span className="text-sm font-semibold text-surface-900 dark:text-white">{seller.products}</span></td>
                    <td className="py-3 px-4"><span className="text-sm font-semibold text-surface-900 dark:text-white">{seller.orders.toLocaleString()}</span></td>
                    <td className="py-3 px-4"><span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{seller.revenue > 0 ? `${(seller.revenue/1000000).toFixed(0)}M` : '—'}</span></td>
                    <td className="py-3 px-4">
                      {seller.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium text-surface-900 dark:text-white">{seller.rating}</span>
                        </div>
                      ) : <span className="text-xs text-surface-400">—</span>}
                    </td>
                    <td className="py-3 px-4"><span className="text-sm font-semibold text-surface-900 dark:text-white">{seller.commission}%</span></td>
                    <td className="py-3 px-4"><Badge variant={st.variant} size="sm">{st.label}</Badge></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedSeller(seller)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 text-surface-400 hover:text-blue-500 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {seller.status === 'pending' && (
                          <>
                            <button onClick={() => approve(seller.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-surface-400 hover:text-emerald-500 transition-colors">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button onClick={() => suspend(seller.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-surface-400 hover:text-red-500 transition-colors">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {seller.status === 'approved' && (
                          <button onClick={() => suspend(seller.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-surface-400 hover:text-red-500 transition-colors">
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Detail Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedSeller(null)} />
          <div className="relative bg-white dark:bg-surface-900 rounded-3xl p-6 max-w-md w-full shadow-xl animate-scale-in">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <Avatar name={selectedSeller.name} size="lg" />
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white">{selectedSeller.name}</h3>
                  <Badge variant={statusMap[selectedSeller.status].variant}>{statusMap[selectedSeller.status].label}</Badge>
                </div>
              </div>
              <button onClick={() => setSelectedSeller(null)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
                <XCircle className="h-5 w-5 text-surface-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Kategoriya', value: selectedSeller.category },
                { label: 'Komissiya', value: `${selectedSeller.commission}%` },
                { label: 'Mahsulotlar', value: selectedSeller.products },
                { label: 'Buyurtmalar', value: selectedSeller.orders.toLocaleString() },
                { label: 'Daromad', value: selectedSeller.revenue > 0 ? `${(selectedSeller.revenue/1000000).toFixed(0)}M` : '—' },
                { label: 'Reyting', value: selectedSeller.rating || '—' },
              ].map(item => (
                <div key={item.label} className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                  <p className="text-xs text-surface-400">{item.label}</p>
                  <p className="text-sm font-bold text-surface-900 dark:text-white mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {selectedSeller.status === 'pending' && (
                <>
                  <Button fullWidth variant="success" onClick={() => { approve(selectedSeller.id); setSelectedSeller(null) }}>Tasdiqlash</Button>
                  <Button fullWidth variant="danger" onClick={() => { suspend(selectedSeller.id); setSelectedSeller(null) }}>Rad etish</Button>
                </>
              )}
              {selectedSeller.status === 'approved' && (
                <Button fullWidth variant="danger" onClick={() => { suspend(selectedSeller.id); setSelectedSeller(null) }}>To'xtatish</Button>
              )}
              {selectedSeller.status === 'suspended' && (
                <Button fullWidth onClick={() => { approve(selectedSeller.id); setSelectedSeller(null) }}>Qayta faollashtirish</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
