'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Plus, Search, Filter, Edit2, Trash2, Eye, MoreHorizontal,
  Package, AlertCircle, TrendingUp, Star, Upload, Download,
  QrCode, Barcode, Image as ImageIcon, Check, X
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { products } from '@/lib/mockData'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'

export default function SellerProductsPage() {
  const [view, setView] = useState<'list' | 'add'>('list')
  const [search, setSearch] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState('all')

  // Add Product Form state
  const [form, setForm] = useState({
    name: '', price: '', originalPrice: '', stock: '', sku: '',
    category: '', description: '', brand: '', weight: ''
  })

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = () => {
    toast.success('✅ Mahsulot muvaffaqiyatli qo\'shildi!')
    setView('list')
  }

  if (view === 'add') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Yangi mahsulot qo'shish</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Asosiy ma'lumotlar</h3>
              <div className="space-y-4">
                <Input
                  label="Mahsulot nomi *"
                  placeholder="iPhone 15 Pro Max 256GB..."
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Brend"
                    placeholder="Apple, Samsung..."
                    value={form.brand}
                    onChange={e => setForm({...form, brand: e.target.value})}
                  />
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Kategoriya *</label>
                    <select
                      className="w-full h-10 px-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-sm focus:outline-none focus:border-purple-500 dark:text-white"
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                    >
                      <option value="">Tanlang...</option>
                      <option>Elektronika</option>
                      <option>Kiyim-kechak</option>
                      <option>Sport</option>
                      <option>Uy-ro'zg'or</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Tavsif *</label>
                  <textarea
                    rows={4}
                    placeholder="Mahsulot haqida batafsil yozing..."
                    className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-sm focus:outline-none focus:border-purple-500 dark:text-white resize-none"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Rasmlar va Video
              </h3>
              <div className="grid grid-cols-5 gap-3">
                <div className="aspect-square rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors col-span-2">
                  <Upload className="h-8 w-8 text-purple-400" />
                  <span className="text-xs text-surface-400 text-center">Asosiy rasm</span>
                  <span className="text-[10px] text-surface-300">800×800 px</span>
                </div>
                {[1,2,3].map(i => (
                  <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-700 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    <Plus className="h-5 w-5 text-surface-300" />
                    <span className="text-[10px] text-surface-300">Rasm {i+1}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-surface-400 mt-3">
                JPG, PNG, WEBP. Maksimal: 5MB. Tavsiya etilgan: 800×800px. Maksimal 8 ta rasm + 1 ta video.
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Narxlar va zaxira</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Narx (so'm) *"
                  placeholder="14500000"
                  type="number"
                  value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})}
                />
                <Input
                  label="Asl narx (chegirma uchun)"
                  placeholder="16000000"
                  type="number"
                  value={form.originalPrice}
                  onChange={e => setForm({...form, originalPrice: e.target.value})}
                  hint={form.price && form.originalPrice ? `${Math.round((1 - +form.price / +form.originalPrice) * 100)}% chegirma` : ''}
                />
                <Input
                  label="Zaxira soni *"
                  placeholder="100"
                  type="number"
                  value={form.stock}
                  onChange={e => setForm({...form, stock: e.target.value})}
                />
                <Input
                  label="SKU"
                  placeholder="APL-IP15PM-256"
                  value={form.sku}
                  onChange={e => setForm({...form, sku: e.target.value})}
                  rightIcon={<QrCode className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-surface-900 dark:text-white">Variantlar</h3>
                <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                  Variant qo'shish
                </Button>
              </div>
              <div className="space-y-3">
                {['Rang', 'O\'lcham', 'Xotira'].map((variant, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300 w-24">{variant}</span>
                    <div className="flex flex-wrap gap-2 flex-1">
                      {i === 0 && ['Qora', 'Oq', 'Ko\'k', 'Titanium'].map(c => (
                        <span key={c} className="px-2.5 py-1 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg text-xs font-medium flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-surface-400" />
                          {c} <button className="text-surface-300 hover:text-red-400"><X className="h-3 w-3" /></button>
                        </span>
                      ))}
                      {i === 1 && ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                        <span key={s} className="px-2.5 py-1 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg text-xs font-medium">
                          {s}
                        </span>
                      ))}
                      {i === 2 && ['128GB', '256GB', '512GB', '1TB'].map(m => (
                        <span key={m} className="px-2.5 py-1 bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg text-xs font-medium">{m}</span>
                      ))}
                    </div>
                    <button className="text-surface-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-surface-900 dark:text-white">Xarakteristikalar</h3>
                <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Qo'shish</Button>
              </div>
              <div className="space-y-2">
                {[['Ekran', '6.7" Super Retina XDR'], ['Protsessor', 'A17 Pro'], ['Batareya', '4422 mAh']].map(([k, v], i) => (
                  <div key={i} className="flex gap-3">
                    <input defaultValue={k} className="flex-1 h-9 px-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-sm focus:outline-none focus:border-purple-500 dark:text-white" />
                    <input defaultValue={v} className="flex-2 h-9 px-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-sm focus:outline-none focus:border-purple-500 dark:text-white flex-1" />
                    <button className="p-2 text-surface-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Settings */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Holat</h3>
              {[
                { label: 'Nashr qilish', desc: 'Do\'konda ko\'rinadi', value: 'published' },
                { label: 'Qoralama', desc: 'Hozircha ko\'rinmaydi', value: 'draft' },
              ].map((opt, i) => (
                <label key={opt.value} className={cn('flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all mb-2', i === 0 && 'bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800')}>
                  <input type="radio" name="status" defaultChecked={i === 0} className="mt-0.5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{opt.label}</p>
                    <p className="text-xs text-surface-400">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Delivery */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Yetkazib berish</h3>
              <div className="space-y-3">
                <Input label="Og'irlik (kg)" placeholder="0.5" />
                <div className="grid grid-cols-3 gap-2">
                  <Input label="Uzunlik" placeholder="15" />
                  <Input label="Kenglik" placeholder="7" />
                  <Input label="Balandlik" placeholder="1" />
                </div>
              </div>
            </div>

            {/* Preview */}
            {form.name && (
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5">
                <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Ko'rinish</h3>
                <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                  <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-2">{form.name}</p>
                  {form.price && <p className="text-base font-bold text-surface-900 dark:text-white mt-1">{formatPrice(+form.price)}</p>}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Button fullWidth size="lg" onClick={handleSubmit} leftIcon={<Check className="h-4 w-4" />}>
                Mahsulotni saqlash
              </Button>
              <Button variant="outline" fullWidth onClick={() => setView('list')}>
                Bekor qilish
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Mahsulotlar</h1>
          <p className="text-sm text-surface-500">{products.length} ta mahsulot</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Export</Button>
          <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>Import</Button>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setView('add')}>
            Qo'shish
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Jami mahsulot', value: products.length, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
          { label: 'Faol', value: products.length - 2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Zaxira tugayapti', value: 5, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10' },
          { label: 'Qoralama', value: 2, color: 'text-surface-500', bg: 'bg-surface-100 dark:bg-surface-800' },
        ].map(s => (
          <div key={s.label} className={cn('rounded-2xl p-4', s.bg)}>
            <p className={cn('text-2xl font-black', s.color)}>{s.value}</p>
            <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Mahsulot nomi, SKU..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'active', 'draft', 'low_stock'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                'px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                statusFilter === f ? 'bg-purple-600 text-white' : 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400'
              )}
            >
              {f === 'all' ? 'Barchasi' : f === 'active' ? 'Faol' : f === 'draft' ? 'Qoralama' : 'Kam zaxira'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={e => setSelectedProducts(e.target.checked ? products.map(p => p.id) : [])}
                    className="rounded text-purple-600"
                  />
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wide">Mahsulot</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wide hidden sm:table-cell">SKU</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wide">Narx</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wide hidden md:table-cell">Zaxira</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wide hidden lg:table-cell">Reyting</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wide">Holat</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={e => setSelectedProducts(
                        e.target.checked ? [...selectedProducts, product.id] : selectedProducts.filter(id => id !== product.id)
                      )}
                      className="rounded text-purple-600"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800 flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-1 max-w-[180px]">{product.name}</p>
                        <p className="text-xs text-surface-400">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="text-xs font-mono text-surface-500">{product.sku}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-bold text-surface-900 dark:text-white">{formatPrice(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-surface-400 line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={cn('text-sm font-semibold', product.stock < 10 ? 'text-orange-500' : product.stock < 20 ? 'text-yellow-500' : 'text-emerald-500')}>
                      {product.stock} ta
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-surface-900 dark:text-white">{product.rating}</span>
                      <span className="text-xs text-surface-400">({product.reviewCount})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={product.stock > 0 ? 'success' : 'error'}>
                      {product.stock > 0 ? 'Faol' : 'Tugagan'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-blue-500 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-purple-600 transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toast.success('O\'chirildi')}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-surface-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-100 dark:border-surface-800">
          <p className="text-sm text-surface-500">{filtered.length} ta mahsulot</p>
          <div className="flex items-center gap-1">
            {[1,2,3].map(p => (
              <button key={p} className={cn('h-8 w-8 rounded-lg text-sm font-medium transition-all', p === 1 ? 'bg-purple-600 text-white' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800')}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
