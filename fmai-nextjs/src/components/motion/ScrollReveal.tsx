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
 * ScrollReveal — SSR-safe wrapper.
 *
 * Previously rendered a `motion.div` with `initial={hidden}` and animated to
 * visible only when `useInView` reported an intersection. That gated all
 * below-fold content behind JavaScript + IntersectionObserver: crawlers,
 * AI agents, and JS-disabled visitors saw blank sections across 18 routes
 * (audit MF-01 / 2026-05-18 v2 cross-cutting synthesis).
 *
 * Now: plain pass-through that always renders children visible on SSR.
 * The directional reveal animation is intentionally removed in favor of
 * content-first rendering. Re-introduce as a post-hydration enhancement
 * via Motion `whileInView` + `initial={false}` only if a future design
 * pass justifies it. Callers keep the same prop signature.
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  return <div className={className}>{children}</div>
}

export default ScrollReveal
