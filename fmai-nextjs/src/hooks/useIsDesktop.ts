'use client'

import { useSyncExternalStore } from 'react'

/**
 * Tracks whether the viewport currently matches the Tailwind `lg` breakpoint
 * (>= 1024px). Returns `false` on SSR and on the first hydration tick so the
 * server-rendered HTML never assumes desktop — only after subscribe runs and
 * `matchMedia` reports `true` does the consumer see `true`.
 *
 * Uses `useSyncExternalStore` (matches the `usePrefersReducedMotion` pattern
 * in ClydeFeaturedTile.tsx) to satisfy the React 19
 * `react-hooks/set-state-in-effect` lint rule.
 *
 * Used to gate heavyweight desktop-only widgets (the GSAP ScrollTrigger
 * dynamic import in HeroSpline). The 1.5 MB Spline runtime gate lives inside
 * SplineScene's own useEffect — see ui/spline.tsx for that boundary.
 */
const LG_BREAKPOINT = '(min-width: 1024px)'

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(LG_BREAKPOINT)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSnapshot(): boolean {
  return window.matchMedia(LG_BREAKPOINT).matches
}

function getServerSnapshot(): boolean {
  return false
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
