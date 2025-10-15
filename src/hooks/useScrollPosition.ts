import { useEffect, useState, useRef } from 'react'

/**
 * Scroll position data with velocity and direction
 */
export interface ScrollPosition {
  /** Current scroll Y position in pixels */
  scrollY: number
  /** Previous scroll Y position in pixels */
  previousScrollY: number
  /** Scroll direction: 1 for down, -1 for up, 0 for no scroll */
  direction: number
  /** Scroll velocity (pixels per second) */
  velocity: number
  /** Normalized scroll progress (0-1) based on document height */
  progress: number
}

/**
 * Configuration options for scroll tracking
 */
export interface UseScrollPositionOptions {
  /** Throttle interval in milliseconds (default: 16ms ~60fps) */
  throttle?: number
  /** Enable velocity calculation */
  trackVelocity?: boolean
}

/**
 * Throttle function - limits how often a function can be called
 */
function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    } else {
      // Schedule the call for later
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(
        () => {
          lastCall = Date.now()
          func(...args)
        },
        delay - (now - lastCall)
      )
    }
  }
}

/**
 * Custom hook for tracking scroll position with throttling and velocity
 * Provides scroll direction, velocity, and normalized progress
 *
 * @param options - Configuration options
 * @returns Scroll position data
 *
 * @example
 * ```tsx
 * const scroll = useScrollPosition({ throttle: 16 })
 *
 * // Use scroll data for animations
 * const rotation = scroll.scrollY * 0.001
 * const isScrollingDown = scroll.direction === 1
 * ```
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}): ScrollPosition {
  const { throttle: throttleMs = 16, trackVelocity = true } = options

  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    previousScrollY: 0,
    direction: 0,
    velocity: 0,
    progress: 0,
  })

  const lastScrollTimeRef = useRef(Date.now())
  const scrollDataRef = useRef({
    lastY: 0,
    lastTime: Date.now(),
  })

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY
      const previousY = scrollDataRef.current.lastY
      const now = Date.now()

      // Calculate direction
      let direction = 0
      if (currentScrollY > previousY) {
        direction = 1
      } else if (currentScrollY < previousY) {
        direction = -1
      }

      // Calculate velocity (pixels per second)
      let velocity = 0
      if (trackVelocity) {
        const deltaY = currentScrollY - previousY
        const deltaTime = (now - scrollDataRef.current.lastTime) / 1000 // Convert to seconds
        velocity = deltaTime > 0 ? deltaY / deltaTime : 0
      }

      // Calculate normalized progress (0-1)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0

      // Update refs
      scrollDataRef.current = {
        lastY: currentScrollY,
        lastTime: now,
      }

      // Update state
      setScrollPosition({
        scrollY: currentScrollY,
        previousScrollY: previousY,
        direction,
        velocity,
        progress: Math.min(Math.max(progress, 0), 1), // Clamp between 0-1
      })

      lastScrollTimeRef.current = now
    }, throttleMs)

    // Initial call
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [throttleMs, trackVelocity])

  return scrollPosition
}

/**
 * Hook variant that returns only scroll progress (0-1)
 * Useful for simple scroll-based animations
 *
 * @param throttle - Throttle interval in milliseconds (default: 16ms)
 * @returns Normalized scroll progress (0-1)
 *
 * @example
 * ```tsx
 * const progress = useScrollProgress()
 * const opacity = 1 - progress // Fade out on scroll
 * ```
 */
export function useScrollProgress(throttle = 16): number {
  const { progress } = useScrollPosition({ throttle, trackVelocity: false })
  return progress
}

/**
 * Hook for detecting scroll direction
 * Returns 1 for down, -1 for up, 0 for no scroll
 *
 * @param throttle - Throttle interval in milliseconds (default: 16ms)
 * @returns Scroll direction
 *
 * @example
 * ```tsx
 * const direction = useScrollDirection()
 * const isScrollingDown = direction === 1
 * ```
 */
export function useScrollDirection(throttle = 16): number {
  const { direction } = useScrollPosition({ throttle, trackVelocity: false })
  return direction
}
