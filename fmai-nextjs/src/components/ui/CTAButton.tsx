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
    primary:
      'bg-gradient-to-br from-[#F5A623] to-[#E8941A] text-bg-deep font-semibold hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(245,166,35,0.3)] active:translate-y-0',
    secondary:
      'bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] text-text-primary hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5',
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
