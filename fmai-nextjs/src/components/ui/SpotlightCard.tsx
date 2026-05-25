'use client'

import type { MouseEvent, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

interface SpotlightCardProps {
  /** Renders as a Link when set, otherwise as a static div (no-link variant for content cards). */
  href?: string
  className?: string
  children: ReactNode
  /** Optional accessible label when the card is non-link content. */
  ariaLabel?: string
}

/**
 * Linear-style spotlight card: tracks pointer position via inline CSS vars
 * so the `.spotlight-card` pseudo-element radial-gradient follows the cursor.
 * No JS animation loop — just CSS var updates. Reduced-motion safe (no
 * transform/scale, opacity-only transition).
 *
 * When `href` is set the card renders a locale-aware Link; otherwise a div.
 * Use the link form for navigable tiles (skills bento, related skills) and
 * the div form for static content cards (features, use cases).
 */
export function SpotlightCard({ href, className, children, ariaLabel }: SpotlightCardProps) {
  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    event.currentTarget.style.setProperty('--mx', `${x}px`)
    event.currentTarget.style.setProperty('--my', `${y}px`)
  }

  if (href) {
    return (
      <Link href={href} onMouseMove={onMouseMove} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <div onMouseMove={onMouseMove} className={className} aria-label={ariaLabel}>
      {children}
    </div>
  )
}
