import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { CalendlyModal } from './CalendlyModal'

interface CTAButtonProps {
  children: React.ReactNode
  /** Primary: warm amber gradient. Secondary: glass backdrop-blur */
  variant?: 'primary' | 'secondary'
  /** sm: nav-sized. md: section CTA. lg: hero CTA */
  size?: 'sm' | 'md' | 'lg'
  /** Show arrow icon */
  arrow?: boolean
  /** Open Calendly modal instead of navigating */
  calendly?: boolean
  /** URL for Calendly modal */
  calendlyUrl?: string
  /** href for regular links */
  href?: string
  /** onClick handler */
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

const CALENDLY_COLORS = 'background_color=111520&text_color=e8ecf4&primary_color=00D4AA'
const DEFAULT_CALENDLY_URL = `https://calendly.com/futureai/strategy-call?${CALENDLY_COLORS}`

/**
 * CTAButton — Consistent CTA across all pages.
 * Primary: warm amber gradient, rounded-btn.
 * Secondary: glass backdrop-blur, rounded-btn.
 * Can open Calendly modal directly.
 */
export const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  calendly = false,
  calendlyUrl,
  href,
  onClick,
  className = '',
  ariaLabel,
}) => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  const variantClasses = {
    primary:
      'bg-gradient-to-br from-accent-human to-[#E8941A] text-bg-deep font-semibold hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(245,166,35,0.3)] active:translate-y-0',
    secondary:
      'bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] text-text-primary hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5',
  }

  const sizeClasses = {
    sm: 'min-h-[36px] px-4 py-2 text-sm',
    md: 'min-h-[44px] px-6 py-3 text-base',
    lg: 'min-h-[56px] px-8 py-4 text-lg',
  }

  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'rounded-btn transition-all duration-200',
    'no-select touch-active',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ')

  const handleClick = () => {
    if (calendly) {
      setIsCalendlyOpen(true)
    } else if (onClick) {
      onClick()
    }
  }

  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="w-4 h-4" />}
    </>
  )

  // If it's a regular link (not calendly, not onClick)
  if (href && !calendly) {
    return (
      <a href={href} className={baseClasses} aria-label={ariaLabel}>
        {content}
      </a>
    )
  }

  return (
    <>
      <button type="button" className={baseClasses} onClick={handleClick} aria-label={ariaLabel}>
        {content}
      </button>
      {calendly && (
        <CalendlyModal
          isOpen={isCalendlyOpen}
          onClose={() => setIsCalendlyOpen(false)}
          url={calendlyUrl || DEFAULT_CALENDLY_URL}
        />
      )}
    </>
  )
}

export default CTAButton
