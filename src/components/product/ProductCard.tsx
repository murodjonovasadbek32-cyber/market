'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Zap, Star, Eye } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { Product } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  className?: string
  variant?: 'default' | 'compact' | 'list'
}

export default function ProductCard({ product, className, variant = 'default' }: ProductCardProps) {
  const [liked, setLiked] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    setLiked(!liked)
    toast.success(liked ? 'Sevimlilardan olib tashlandi' : '❤️ Sevimlilarga qo\'shildi')
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    setAddedToCart(true)
    toast.success('🛒 Savatchaga qo\'shildi!')
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  if (variant === 'list') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          'flex gap-4 p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800',
          'hover:shadow-card-hover hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300',
          className
        )}
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-50 dark:bg-surface-800">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-2">{product.name}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-surface-600 dark:text-surface-400">{product.rating}</span>
            <span className="text-xs text-surface-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-surface-900 dark:text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-surface-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn('group block', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-card overflow-hidden transition-all duration-300 group-hover:shadow-card-hover group-hover:border-purple-200 dark:group-hover:border-purple-800 group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square bg-surface-50 dark:bg-surface-800 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">YANGI</span>
            )}
            {product.isBestseller && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full">🔥 TOP</span>
            )}
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">-{discountPercent}%</span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            <button
              onClick={handleLike}
              className={cn(
                'h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200',
                'bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm shadow-sm',
                'hover:scale-110',
                liked ? 'text-red-500' : 'text-surface-400 hover:text-red-500'
              )}
            >
              <Heart className={cn('h-4 w-4', liked && 'fill-red-500')} />
            </button>
            <button
              className={cn(
                'h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200',
                'bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm shadow-sm text-surface-400 hover:text-purple-600',
                'hover:scale-110',
                hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              )}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Add to Cart Hover */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-3 transition-all duration-300',
              hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <button
              onClick={handleAddToCart}
              className={cn(
                'w-full h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200',
                addedToCart
                  ? 'bg-emerald-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white backdrop-blur-sm'
              )}
            >
              {addedToCart ? (
                <>✓ Qo'shildi</>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Savatchaga
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-surface-400 mb-1">{product.category}</p>
          <h3 className="text-sm font-medium text-surface-900 dark:text-white line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-3 w-3',
                    star <= Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-surface-200 dark:text-surface-700'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-surface-500">({product.reviewCount.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-surface-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.originalPrice && (
                <span className="text-xs text-surface-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Seller */}
          <div className="mt-2 pt-2 border-t border-surface-50 dark:border-surface-800 flex items-center justify-between">
            <span className="text-[10px] text-surface-400 truncate">{product.sellerName}</span>
            {product.stock < 10 && (
              <span className="text-[10px] text-orange-500 font-medium">Kam qoldi: {product.stock} ta</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
