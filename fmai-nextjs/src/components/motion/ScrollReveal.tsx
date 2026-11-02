import { type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  /** Accepted but unused — kept for backward-compat with 18 routes. */
  delay?: number
  /** Accepted but unused — kept for backward-compat with 18 routes. */
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

/**
 * ScrollReveal — SSR-safe wrapper with a CSS-only reveal.
 *
 * Previously rendered a `motion.div` with `initial={hidden}` and animated to
 * visible only when `useInView` reported an intersection. That gated all
 * below-fold content behind JavaScript + IntersectionObserver: crawlers,
 * AI agents, and JS-disabled visitors saw blank sections across 18 routes
 * (audit MF-01 / 2026-05-18 v2 cross-cutting synthesis).
 *
 * Now: a server-rendered div with `.fm-reveal` (src/app/motion.css), a CSS
 * view-timeline reveal. The children are always in the HTML; without view()
 * support or with reduced motion no animation applies and they are visible.
 * Callers keep the same prop signature.
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  return <div className={className ? `fm-reveal ${className}` : 'fm-reveal'}>{children}</div>
}

export default ScrollReveal
