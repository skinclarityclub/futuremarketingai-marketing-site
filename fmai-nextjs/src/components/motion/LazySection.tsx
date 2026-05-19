import { type ReactNode } from 'react'

interface LazySectionProps {
  children: ReactNode
  /** Accepted but unused — kept for backward-compat. */
  minHeight?: string
  /** Accepted but unused — kept for backward-compat. */
  rootMargin?: string
  className?: string
}

/**
 * LazySection — SSR-safe wrapper.
 *
 * Previously initialised `isVisible: false` and gated children behind an
 * IntersectionObserver effect. Crawlers, AI agents, and JS-disabled
 * visitors saw an empty placeholder div with no content (audit MF-01 /
 * 2026-05-18 v2). The "lazy" deferral never delivered measurable value:
 * the deferred children were not heavy enough to justify hiding them.
 *
 * Now: pass-through. Children always render in the initial SSR HTML.
 * If a future page introduces a genuinely heavy below-fold widget
 * (Spline scene, large 3D asset), prefer a `dynamic()` import with
 * `loading` skeleton over reintroducing this pattern.
 */
export function LazySection({ children, className }: LazySectionProps) {
  return <div className={className}>{children}</div>
}
