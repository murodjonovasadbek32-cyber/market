'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3, Settings,
  Bell, ChevronDown, Store, Wallet, Menu, X, LogOut,
  MessageSquare, Tag, Star, Truck, TrendingUp
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'

const NAV_ITEMS = [
  { href: '/seller',           icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/seller/products',  icon: Package,         label: 'Mahsulotlar' },
  { href: '/seller/orders',    icon: ShoppingBag,     label: 'Buyurtmalar' },
  { href: '/seller/analytics', icon: BarChart3,       label: 'Statistika' },
  { href: '/seller/reviews',   icon: Star,            label: 'Sharhlar' },
  { href: '/seller/coupons',   icon: Tag,             label: 'Kuponlar' },
  { href: '/seller/wallet',    icon: Wallet,          label: 'Hamyon' },
  { href: '/seller/settings',  icon: Settings,        label: 'Sozlamalar' },
]

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-surface-950 text-white flex flex-col transition-transform duration-300',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-800 shrink-0">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">Market.uz</p>
            <p className="text-[10px] text-surface-400">Seller Kabineti</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-surface-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Seller Info */}
        <div className="px-4 py-4 border-b border-surface-800 shrink-0">
          <div className="flex items-center gap-3 p-3 bg-surface-800 rounded-xl">
            <Avatar name="TechZone UZ" size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">TechZone UZ</p>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                <p className="text-[10px] text-emerald-400">Faol · Tasdiqlangan</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-surface-800 rounded-xl p-2.5 text-center">
              <p className="text-sm font-bold text-emerald-400">15.2M</p>
              <p className="text-[10px] text-surface-400">Balans</p>
            </div>
            <div className="bg-surface-800 rounded-xl p-2.5 text-center">
              <p className="text-sm font-bold text-yellow-400">4.8 ⭐</p>
              <p className="text-[10px] text-surface-400">Reyting</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                pathname === item.href
                  ? 'bg-purple-600 text-white'
                  : 'text-surface-300 hover:bg-surface-800 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-surface-800 shrink-0">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:bg-surface-800 hover:text-white transition-all">
            <LogOut className="h-4 w-4" />
            Do'konga qaytish
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800 flex items-center gap-4 px-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
            <Menu className="h-5 w-5 text-surface-600 dark:text-surface-400" />
          </button>
          <h1 className="text-base font-bold text-surface-900 dark:text-white hidden sm:block">
            {NAV_ITEMS.find(i => i.href === pathname)?.label || 'Seller Kabineti'}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <Wallet className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">15 200 000 so'm</span>
            </div>
            <button className="relative p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
              <Bell className="h-5 w-5 text-surface-600 dark:text-surface-400" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <Avatar name="TechZone UZ" size="sm" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
