import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = 'UZS'): string {
  if (currency === 'UZS') {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m'
  }
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency,
  }).format(price)
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'Hozir'
  if (diffMins < 60) return `${diffMins} daqiqa oldin`
  if (diffHours < 24) return `${diffHours} soat oldin`
  if (diffDays < 7) return `${diffDays} kun oldin`
  return formatDate(date)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const ORDER_STATUSES = [
  { id: 1, key: 'created', label: 'Buyurtma yaratildi', color: 'text-gray-500' },
  { id: 2, key: 'paid', label: 'To\'lov qabul qilindi', color: 'text-blue-500' },
  { id: 3, key: 'preparing', label: 'Sotuvchi tayyorlamoqda', color: 'text-yellow-500' },
  { id: 4, key: 'at_warehouse', label: 'Omborga topshirildi', color: 'text-orange-500' },
  { id: 5, key: 'sorting', label: 'Saralanmoqda', color: 'text-purple-500' },
  { id: 6, key: 'in_transit', label: 'Yo\'lda', color: 'text-indigo-500' },
  { id: 7, key: 'at_pickup', label: 'Qabul punktiga yetdi', color: 'text-teal-500' },
  { id: 8, key: 'delivered', label: 'Xaridorga topshirildi', color: 'text-green-500' },
] as const

export type OrderStatus = typeof ORDER_STATUSES[number]['key']
