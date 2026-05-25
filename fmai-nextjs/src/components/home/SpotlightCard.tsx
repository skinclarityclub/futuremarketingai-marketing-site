'use client'

import type { MouseEvent, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

interface SpotlightCardProps {
  href: string
  className?: string
  children: ReactNode
}

/**
 * Linear-style spotlight card: tracks pointer position via inline CSS vars
 * so the `.spotlight-card` pseudo-element radial-gradient follows the cursor.
 * No JS animation loop — just CSS var updates. Reduced-motion safe (no
 * transform/scale, opacity-only transition).
 */
export function SpotlightCard({ href, className, children }: SpotlightCardProps) {
  const onMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    event.currentTarget.style.setProperty('--mx', `${x}px`)
    event.currentTarget.style.setProperty('--my', `${y}px`)
  }

  return (
    <Link href={href} onMouseMove={onMouseMove} className={className}>
      {children}
    </Link>
  )
}
