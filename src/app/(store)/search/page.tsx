'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, SlidersHorizontal, Grid3x3, List, ChevronDown, X, Star } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { products, categories } from '@/lib/mockData'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(query)
  const [inStock, setInStock] = useState(false)
  const [onSale, setOnSale] = useState(false)

  const filtered = products.filter(p => {
    if (inStock && p.stock === 0) return false
    if (onSale && !p.discount) return false
    if (selectedRating && p.rating < selectedRating) return false
    if (selectedCategories.length && !selectedCategories.includes(p.categoryId)) return false
    return true
  })

  const sortOptions = [
    { value: 'relevance', label: 'Tegishlilik' },
    { value: 'price_asc', label: "Narx: kamdan ko'pga" },
    { value: 'price_desc', label: "Narx: ko'pdan kamga" },
    { value: 'rating', label: "Reyting bo'yicha" },
    { value: 'newest', label: 'Yangilar avval' },
    { value: 'bestseller', label: "Ko'p sotilgan" },
  ]

  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Kategoriya</h4>
        <div className="space-y-2">
          {categories.slice(0, 8).map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedCategories(prev => [...prev, cat.id])
                  else setSelectedCategories(prev => prev.filter(id => id !== cat.id))
                }}
                className="h-4 w-4 rounded border-surface-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-surface-600 dark:text-surface-400 group-hover:text-surface-900 dark:group-hover:text-white transition-colors flex-1">
                {cat.icon} {cat.name}
              </span>
              <span className="text-xs text-surface-400">{(cat.productCount / 1000).toFixed(0)}K</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Narx diapazoni</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Dan"
            className="w-full h-9 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 text-xs focus:outline-none focus:border-purple-500"
          />
          <input
            type="number"
            placeholder="Gacha"
            className="w-full h-9 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 text-xs focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          {[
            { label: '0–500K', min: 0, max: 500000 },
            { label: '500K–2M', min: 500000, max: 2000000 },
            { label: '2M–10M', min: 2000000, max: 10000000 },
            { label: '10M+', min: 10000000, max: 99999999 },
          ].map((range) => (
            <button
              key={range.label}
              className="px-2 py-1.5 text-xs font-medium bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-purple-400 hover:text-purple-600 transition-all"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Minimal reyting</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(selectedRating === r ? 0 : r)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all',
                selectedRating === r
                  ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                  : 'hover:bg-surface-50 dark:hover:bg-surface-800'
              )}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('h-3.5 w-3.5', i < r ? 'text-yellow-400 fill-yellow-400' : 'text-surface-200')} />
                ))}
              </div>
              <span className="text-surface-600 dark:text-surface-400">va undan yuqori</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        {[
          { label: 'Faqat mavjudlar', value: inStock, onChange: setInStock },
          { label: 'Faqat chegirmalillar', value: onSale, onChange: setOnSale },
        ].map((toggle) => (
          <label key={toggle.label} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-surface-700 dark:text-surface-300">{toggle.label}</span>
            <div
              onClick={() => toggle.onChange(!toggle.value)}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors cursor-pointer',
                toggle.value ? 'bg-purple-600' : 'bg-surface-200 dark:bg-surface-700'
              )}
            >
              <div className={cn(
                'absolute top-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform',
                toggle.value ? 'translate-x-4' : 'translate-x-0.5'
              )} />
            </div>
          </label>
        ))}
      </div>

      <Button variant="primary" fullWidth onClick={() => setFiltersOpen(false)}>
        Filtrlash ({filtered.length})
      </Button>
    </div>
  )

  return (
    <div className="bg-surface-50 dark:bg-surface-950 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Mahsulot qidiring..."
              leftIcon={<Search className="h-4 w-4" />}
              inputSize="lg"
              className="flex-1"
            />
            <Button size="lg" leftIcon={<Search className="h-4 w-4" />}>
              Izlash
            </Button>
          </div>
          {query && (
            <div className="flex items-center justify-between">
              <p className="text-surface-600 dark:text-surface-400 text-sm">
                <span className="font-semibold text-surface-900 dark:text-white">"{query}"</span> bo'yicha{' '}
                <span className="text-purple-600 font-semibold">{filtered.length} ta</span> natija topildi
              </p>
              <div className="flex items-center gap-2 text-xs text-surface-400">
                <span>AI tavsiyasi:</span>
                <div className="flex gap-1">
                  {['iPhone', 'Samsung', 'Xiaomi'].map(s => (
                    <button key={s} className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter — Desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-surface-900 dark:text-white">Filterlar</h3>
                <button className="text-xs text-purple-600 hover:text-purple-700">Tozalash</button>
              </div>
              <FilterPanel />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-medium"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filterlar
                </button>
                <p className="text-sm text-surface-500 hidden sm:block">
                  {filtered.length} natija
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:border-purple-500 dark:text-white"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('p-2', viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-surface-900 text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('p-2', viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-surface-900 text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedRating > 0 || inStock || onSale) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map(id => {
                  const cat = categories.find(c => c.id === id)
                  return cat ? (
                    <span key={id} className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                      {cat.name}
                      <button onClick={() => setSelectedCategories(prev => prev.filter(i => i !== id))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null
                })}
                {inStock && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                    Mavjud <button onClick={() => setInStock(false)}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} variant="list" />
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="mt-8 flex justify-center">
              <Button variant="outline" size="lg">
                Ko'proq yuklash
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-surface-900 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-surface-900 dark:text-white">Filterlar</h3>
              <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" /></div>}>
      <SearchContent />
    </Suspense>
  )
}
