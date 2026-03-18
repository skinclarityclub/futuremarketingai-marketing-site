import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { twMerge } from 'tailwind-merge'

interface CTAButtonProps {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function CTAButton({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  disabled = false,
}: CTAButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-btn)] transition-all'

  const variantStyles = {
    primary: 'bg-accent-system text-bg-deep hover:bg-accent-system/90',
    secondary: 'bg-bg-elevated border border-border-primary text-text-primary hover:bg-bg-surface',
    ghost: 'text-text-secondary hover:text-text-primary',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const styles = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  if (href && !disabled) {
    if (href.startsWith('http')) {
      return (
        <a href={href} className={styles} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={styles} disabled={disabled}>
      {children}
    </button>
  )
}
