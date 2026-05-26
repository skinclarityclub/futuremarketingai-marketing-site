import type { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { twMerge } from 'tailwind-merge'

interface CTAButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  /** Optional right-aligned icon (e.g. ArrowRight). Hidden from a11y tree. */
  icon?: ReactNode
  /** Optional left-aligned icon. */
  iconLeft?: ReactNode
  /**
   * Forwarded to next/link. Set `false` on above-the-fold CTAs where the
   * prefetched chunks (Zod from /apply, ChatSimulation from /skills/clyde,
   * etc.) would otherwise compete with hero LCP — Next.js still warm-fetches
   * on hover so the click penalty is ~50 ms.
   */
  prefetch?: boolean
}

export function CTAButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  disabled = false,
  icon,
  iconLeft,
  prefetch,
}: CTAButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-btn)] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system'

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

  const content = (
    <>
      {iconLeft && (
        <span className="shrink-0" aria-hidden>
          {iconLeft}
        </span>
      )}
      {children}
      {icon && (
        <span className="shrink-0" aria-hidden>
          {icon}
        </span>
      )}
    </>
  )

  if (href && !disabled && !onClick) {
    if (href.startsWith('http')) {
      return (
        <a href={href} className={styles} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={styles} prefetch={prefetch}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={styles} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  )
}
