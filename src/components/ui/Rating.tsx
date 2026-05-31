import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface RatingProps {
  value: number
  max?: number
  size?: 'xs' | 'sm' | 'md'
  showValue?: boolean
  count?: number
  className?: string
}

export default function Rating({ value, max = 5, size = 'sm', showValue = false, count, className }: RatingProps) {
  const starSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i + 1 <= Math.floor(value)
          const partial = i + 1 > Math.floor(value) && i < value

          return (
            <div key={i} className="relative">
              <Star
                className={cn(
                  starSizes[size],
                  'text-surface-200 dark:text-surface-700'
                )}
              />
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : `${(value % 1) * 100}%` }}
                >
                  <Star
                    className={cn(starSizes[size], 'text-yellow-400 fill-yellow-400')}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-surface-400">({count.toLocaleString()})</span>
      )}
    </div>
  )
}
