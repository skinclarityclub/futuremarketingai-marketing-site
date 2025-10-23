import { useState, useEffect } from 'react'

/**
 * useMediaQuery Hook Options
 */
export interface UseMediaQueryOptions {
  /**
   * Default value to use during SSR or when window is undefined
   * @default false
   */
  defaultValue?: boolean
  /**
   * Whether to initialize with the actual value immediately (on mount)
   * If false, will use defaultValue until first client-side render
   * @default true
   */
  initializeWithValue?: boolean
}

/**
 * useMediaQuery Hook
 *
 * Detects if a CSS media query matches the current viewport.
 * Supports SSR with configurable fallback behavior.
 * Automatically syncs with Tailwind's mobile-first breakpoints.
 *
 * @param query - CSS media query string
 * @param options - Configuration options for SSR and initialization
 *
 * @example
 * // Basic usage
 * const isMobile = useMediaQuery('(max-width: 768px)')
 *
 * @example
 * // With SSR fallback
 * const isMobile = useMediaQuery('(max-width: 768px)', { 
 *   defaultValue: false,
 *   initializeWithValue: false 
 * })
 *
 * @example
 * // Convenience hooks
 * const isMobile = useIsMobile()
 * const isTablet = useIsTablet()
 * const isDesktop = useIsDesktop()
 */
export const useMediaQuery = (
  query: string,
  options: UseMediaQueryOptions = {}
): boolean => {
  const { defaultValue = false, initializeWithValue = true } = options

  const getMatches = (query: string): boolean => {
    // SSR safe check
    if (typeof window === 'undefined') {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  useEffect(() => {
    // SSR safe check
    if (typeof window === 'undefined') {
      return
    }

    const mediaQueryList = window.matchMedia(query)

    // Update state when query match changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern addEventListener API (preferred)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      // @ts-ignore - deprecated but needed for Safari < 14
      mediaQueryList.addListener(handleChange)
    }

    // Set initial value on mount
    setMatches(mediaQueryList.matches)

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        // @ts-ignore - deprecated but needed for Safari < 14
        mediaQueryList.removeListener(handleChange)
      }
    }
  }, [query]) // Re-run if query changes

  return matches
}

/**
 * Convenience hooks for common breakpoints
 * Aligned with Tailwind's mobile-first breakpoints from Task 1
 */

/**
 * Detects mobile devices (0-639px)
 * Aligned with Tailwind's 'mobile' breakpoint
 */
export const useIsMobile = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(max-width: 639px)', options)

/**
 * Detects tablet devices (640-1023px)
 * Aligned with Tailwind's 'tablet' breakpoint
 */
export const useIsTablet = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(min-width: 640px) and (max-width: 1023px)', options)

/**
 * Detects desktop devices (1024px+)
 * Aligned with Tailwind's 'desktop' breakpoint
 */
export const useIsDesktop = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(min-width: 1024px)', options)

/**
 * Detects if viewport is mobile OR tablet (< 1024px)
 * Useful for loading mobile-optimized components
 */
export const useIsMobileOrTablet = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(max-width: 1023px)', options)

/**
 * Detects user preference for reduced motion
 * Important for accessibility
 */
export const usePrefersReducedMotion = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(prefers-reduced-motion: reduce)', options)

/**
 * Detects touch-enabled devices
 * Uses pointer: coarse to detect primary input is touch
 */
export const useIsTouchDevice = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(pointer: coarse)', options)

/**
 * Detects dark mode preference
 * System-level theme detection
 */
export const usePrefersDarkMode = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(prefers-color-scheme: dark)', options)

/**
 * Detects high resolution displays (Retina, HiDPI)
 */
export const useIsRetina = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)', options)

/**
 * Detects portrait orientation
 */
export const useIsPortrait = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(orientation: portrait)', options)

/**
 * Detects landscape orientation
 */
export const useIsLandscape = (options?: UseMediaQueryOptions) => 
  useMediaQuery('(orientation: landscape)', options)

export default useMediaQuery
