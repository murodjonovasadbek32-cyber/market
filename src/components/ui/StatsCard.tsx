import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  iconBg?: string
  className?: string
}

export default function StatsCard({
  title,
  value,
  change,
  changeLabel = 'o\'tgan oyga nisbatan',
  icon,
  iconBg = 'bg-purple-100 dark:bg-purple-900/20',
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0

  return (
    <div
      className={cn(
        'bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 p-5',
        'shadow-card hover:shadow-card-hover transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{title}</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-medium',
                  isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-surface-400">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-2xl', iconBg)}>{icon}</div>
      </div>
    </div>
  )
}
