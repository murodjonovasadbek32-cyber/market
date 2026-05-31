'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  Search, ShoppingCart, Heart, Bell, Sun, Moon, Menu, X,
  ChevronDown, MapPin, Zap, Package, User, LogOut, Settings,
  Mic, QrCode
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { categories } from '@/lib/mockData'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartCount] = useState(3)
  const [wishlistCount] = useState(12)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const suggestions = ['iPhone 15', 'Samsung Galaxy', 'Nike Air Max', 'Macbook Pro', 'Sony Headphones']

  return (
    <>
      {/* Top Bar */}
      <div className="bg-surface-950 text-white text-xs py-2 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-surface-400">
              <Zap className="h-3 w-3 text-yellow-400" />
              Bugungi maxsus taklif: 
              <span className="text-yellow-400 font-semibold ml-1">iPhone 15 Pro — 9% chegirma!</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-surface-400">
            <Link href="/help" className="hover:text-white transition-colors">Yordam</Link>
            <Link href="/seller/register" className="hover:text-white transition-colors">Sotuvchi bo'ling</Link>
            <Link href="/track" className="hover:text-white transition-colors">Buyurtmani kuzatish</Link>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Toshkent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-100/50 dark:border-surface-800/50 shadow-sm'
            : 'bg-white dark:bg-surface-950 border-b border-surface-100 dark:border-surface-800'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-purple">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-surface-900 dark:text-white">
                  Market
                </span>
                <span className="text-lg font-bold text-purple-600">.uz</span>
              </div>
            </Link>

            {/* Category Dropdown */}
            <div className="hidden lg:block relative group">
              <button className="flex items-center gap-1.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2 px-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/10">
                <Menu className="h-4 w-4" />
                Kategoriyalar
                <ChevronDown className="h-3 w-3" />
              </button>
              {/* Mega Menu */}
              <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-surface-900 rounded-2xl shadow-card-hover border border-surface-100 dark:border-surface-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors group/item"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-surface-800 dark:text-surface-200 group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs text-surface-400">{(cat.productCount / 1000).toFixed(0)}K+</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-2xl border transition-all duration-200',
                  'bg-surface-50 dark:bg-surface-800',
                  searchFocused
                    ? 'border-purple-500 ring-3 ring-purple-500/20 bg-white dark:bg-surface-900'
                    : 'border-surface-200 dark:border-surface-700'
                )}
              >
                <Search className="h-4 w-4 text-surface-400 ml-4 shrink-0" />
                <input
                  type="text"
                  placeholder="Mahsulot, brend, kategoriya qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="flex-1 h-10 bg-transparent text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none"
                />
                <div className="flex items-center gap-1 pr-2">
                  <button className="p-1.5 text-surface-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <Mic className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-surface-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <QrCode className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/search?q=${searchQuery}`}
                    className="h-7 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-xl transition-colors"
                  >
                    Izlash
                  </Link>
                </div>
              </div>

              {/* Search Suggestions */}
              {searchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-surface-900 rounded-2xl shadow-card-hover border border-surface-100 dark:border-surface-800 z-50 overflow-hidden animate-fade-in">
                  <div className="p-2">
                    <p className="text-xs font-medium text-surface-400 px-3 py-2">Ommabop qidiruvlar</p>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 transition-colors text-left"
                      >
                        <Search className="h-3 w-3 text-surface-400" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}

              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-surface-950" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors hidden sm:flex"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <Avatar name="Jasur Toshmatov" size="sm" />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-surface-900 dark:text-white leading-tight">Jasur T.</p>
                    <p className="text-[10px] text-surface-400">1,250 bonus</p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-surface-400 hidden md:block" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-surface-900 rounded-2xl shadow-card-hover border border-surface-100 dark:border-surface-800 z-50 animate-fade-in overflow-hidden">
                    <div className="p-4 border-b border-surface-100 dark:border-surface-800">
                      <div className="flex items-center gap-3">
                        <Avatar name="Jasur Toshmatov" size="md" />
                        <div>
                          <p className="font-semibold text-surface-900 dark:text-white text-sm">Jasur Toshmatov</p>
                          <p className="text-xs text-surface-400">jasur@example.com</p>
                        </div>
                      </div>
                      <div className="mt-3 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">💎 1,250 bonus ball</p>
                      </div>
                    </div>
                    <div className="p-2">
                      {[
                        { icon: Package, label: 'Buyurtmalarim', href: '/profile/orders' },
                        { icon: Heart, label: 'Sevimlilar', href: '/wishlist' },
                        { icon: Settings, label: 'Sozlamalar', href: '/profile/settings' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 transition-colors"
                        >
                          <item.icon className="h-4 w-4 text-surface-400" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="p-2 border-t border-surface-100 dark:border-surface-800">
                      <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-sm text-red-600 dark:text-red-400 transition-colors">
                        <LogOut className="h-4 w-4" />
                        Chiqish
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 pb-2">
            {[
              { label: '🔥 Trend', href: '/trending' },
              { label: '⚡ Flash Sale', href: '/flash-sale' },
              { label: '🎁 Chegirmalar', href: '/deals' },
              { label: '✨ Yangiliklar', href: '/new' },
              { label: '⭐ Top Sotuvchilar', href: '/top-sellers' },
              { label: '🚀 Ekspress', href: '/express' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-xl transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-950 animate-fade-in">
            <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-1">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm font-medium text-surface-800 dark:text-surface-200">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
