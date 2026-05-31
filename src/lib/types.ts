export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
  category: string
  categoryId: string
  brand?: string
  rating: number
  reviewCount: number
  stock: number
  sku: string
  barcode?: string
  sellerId: string
  sellerName: string
  sellerRating: number
  tags: string[]
  variants?: ProductVariant[]
  specifications?: ProductSpec[]
  isNew?: boolean
  isFeatured?: boolean
  isBestseller?: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  options: string[]
  price?: number
  stock?: number
}

export interface ProductSpec {
  key: string
  value: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  productCount: number
  parentId?: string
  children?: Category[]
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: 'buyer' | 'seller' | 'admin' | 'logistics'
  isVerified: boolean
  createdAt: string
  bonusPoints?: number
}

export interface Seller extends User {
  shopName: string
  shopSlug: string
  shopDescription: string
  shopBanner?: string
  shopAvatar?: string
  rating: number
  totalSales: number
  totalProducts: number
  isApproved: boolean
  commission: number
  balance: number
}

export interface Order {
  id: string
  orderNumber: string
  buyerId: string
  buyerName: string
  items: OrderItem[]
  totalAmount: number
  status: string
  statusHistory: OrderStatusHistory[]
  shippingAddress: Address
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  sellerId: string
  sellerName: string
}

export interface OrderStatusHistory {
  status: string
  timestamp: string
  note?: string
}

export interface Address {
  id: string
  label: string
  fullName: string
  phone: string
  region: string
  city: string
  street: string
  apartment?: string
  isDefault: boolean
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  images?: string[]
  likes: number
  createdAt: string
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  link: string
  isActive: boolean
  order: number
}

export interface Coupon {
  id: string
  code: string
  discount: number
  discountType: 'percent' | 'fixed'
  minOrder?: number
  maxDiscount?: number
  expiresAt: string
  usedCount: number
  maxUses: number
  isActive: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'order' | 'payment' | 'promotion' | 'system'
  isRead: boolean
  createdAt: string
  link?: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedVariant?: Record<string, string>
}

export interface DashboardStats {
  revenue: number
  revenueGrowth: number
  orders: number
  ordersGrowth: number
  customers: number
  customersGrowth: number
  products: number
  conversion: number
}

export interface ChartData {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  image: string
  sales: number
  revenue: number
  stock: number
}
