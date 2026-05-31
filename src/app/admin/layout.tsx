'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Store, Package, ShoppingBag, Tag,
  Image, Settings, Bell, Shield, BarChart3, Truck, LogOut,
  Menu, X, ChevronRight, AlertTriangle, TrendingUp, Wallet,
  MessageSquare, Flag, Database
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'

const NAV_GROUPS = [
  {
    label: 'Asosiy',
    items: [
      { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/analytics',  icon: BarChart3,       label: 'Statistika' },
    ]
  },
  {
    label: 'Foydalanuvchilar',
    items: [
      { href: '/admin/users',    icon: Users,   label: 'Xaridorlar',   badge: null },
      { href: '/admin/sellers',  icon: Store,   label: 'Sotuvchilar',  badge: '12' },
    ]
  },
  {
    label: 'Savdo',
    items: [
      { href: '/admin/products',  icon: Package,    label: 'Mahsulotlar',  badge: '8' },
      { href: '/admin/orders',    icon: ShoppingBag,label: 'Buyurtmalar',  badge: null },
      { href: '/admin/coupons',   icon: Tag,        label: 'Kuponlar',     badge: null },
      { href: '/admin/finance',   icon: Wallet,     label: 'Moliya',       badge: null },
    ]
  },
  {
    label: 'Kontent',
    items: [
      { href: '/admin/banners',    icon: Image,      label: 'Bannerlar',    badge: null },
      { href: '/admin/categories', icon: Database,   label: 'Kategoriyalar',badge: null },
      { href: '/admin/reviews',    icon: MessageSquare, label: 'Sharhlar',  badge: '3' },
      { href: '/admin/reports',    icon: Flag,       label: 'Shikoyatlar',  badge: '5' },
    ]
  },
  {
    label: 'Tizim',
    items: [
      { href: '/admin/logistics', icon: Truck,    label: 'Logistika',    badge: null },
      { href: '/admin/settings',  icon: Settings, label: 'Sozlamalar',   badge: null },
    ]
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentLabel = NAV_GROUPS.flatMap(g => g.items).find(i => i.href === pathname)?.label || 'Admin Panel'

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800 flex flex-col transition-transform duration-300',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-100 dark:border-surface-800 shrink-0">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-purple">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-surface-900 dark:text-white">Market.uz</p>
            <p className="text-[10px] text-surface-400">Super Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-surface-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800 shrink-0">
          <div className="flex items-center gap-3 p-2.5 bg-surface-50 dark:bg-surface-800 rounded-xl">
            <Avatar name="Admin" size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">Super Admin</p>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Barcha huquqlar</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider px-3 mb-1">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      pathname === item.href
                        ? 'bg-purple-600 text-white shadow-purple'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="h-5 min-w-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-surface-100 dark:border-surface-800 shrink-0 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
            <ChevronRight className="h-4 w-4 rotate-180" />
            Saytga qaytish
          </Link>
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
            <LogOut className="h-4 w-4" />
            Chiqish
          </button>
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

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm">
            <Shield className="h-4 w-4 text-purple-600" />
            <span className="text-surface-400">/</span>
            <span className="font-semibold text-surface-900 dark:text-white">{currentLabel}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Live indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse-soft" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Live</span>
            </div>
            <button className="relative p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800">
              <Bell className="h-5 w-5 text-surface-600 dark:text-surface-400" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-2">
              <Avatar name="Admin" size="sm" />
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300 hidden sm:block">Super Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
