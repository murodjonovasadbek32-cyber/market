'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-purple active:bg-purple-800',
      secondary:
        'bg-surface-100 hover:bg-surface-200 text-surface-900 dark:bg-surface-800 dark:hover:bg-surface-700 dark:text-white',
      outline:
        'border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-900 dark:text-white bg-transparent',
      ghost:
        'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 bg-transparent',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm',
      success:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-green',
    }

    const sizes = {
      xs: 'h-7 px-3 text-xs rounded-lg gap-1.5',
      sm: 'h-8 px-3.5 text-sm rounded-lg gap-1.5',
      md: 'h-10 px-4 text-sm rounded-xl gap-2',
      lg: 'h-11 px-6 text-base rounded-xl gap-2',
      xl: 'h-12 px-8 text-base rounded-2xl gap-2.5',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
