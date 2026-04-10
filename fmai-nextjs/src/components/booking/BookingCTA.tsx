'use client'

import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useBookingStore } from '@/stores/bookingStore'

interface BookingCTAProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * BookingCTA -- Client component button that opens the booking modal.
 *
 * Use this in Server Components (skill pages, home page) where you cannot
 * pass onClick handlers directly. Mirrors CTAButton's visual styles.
 */
export function BookingCTA({
  children,
  variant = 'primary',
  size = 'md',
  className,
}: BookingCTAProps) {
  const openBooking = useBookingStore((s) => s.openBooking)

  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-btn)] transition-all'

  const variantStyles = {
    primary:
      'bg-gradient-to-br from-[#F5A623] to-[#E8941A] text-bg-deep font-semibold hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(245,166,35,0.3)] active:translate-y-0',
    secondary:
      'bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] text-text-primary hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      type="button"
      className={twMerge(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      onClick={openBooking}
    >
      {children}
    </button>
  )
}
