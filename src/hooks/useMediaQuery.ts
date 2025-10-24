import { useState, useEffect } from 'react'

/**
 * useMediaQuery Hook
 *
 * Detects if a CSS media query matches the current viewport.
 * Used for responsive mobile optimization.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    // Update state when query changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern addEventListener API
    mediaQuery.addEventListener('change', handler)

    // Set initial value
    setMatches(mediaQuery.matches)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}

/**
 * Convenience hooks for common breakpoints
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsTouchDevice = () => useMediaQuery('(pointer: coarse)')

export default useMediaQuery
