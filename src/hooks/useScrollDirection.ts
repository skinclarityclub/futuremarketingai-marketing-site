import { useState, useEffect, useCallback, useRef } from 'react'

export type ScrollDirection = 'up' | 'down' | 'none'

interface UseScrollBehaviorOptions {
  /** Minimum scroll distance to trigger direction change (px) */
  threshold?: number
  /** Debounce delay in ms */
  debounce?: number
}

/**
 * useScrollBehavior Hook
 * 
 * Detects the current scroll direction (up/down) with debouncing.
 * Useful for showing/hiding UI elements based on scroll behavior.
 * 
 * @param options Configuration options
 * @returns Current scroll direction and scroll position
 */
export const useScrollBehavior = (
  options: UseScrollBehaviorOptions = {}
) => {
  const { threshold = 10, debounce = 100 } = options
  
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none')
  const [scrollY, setScrollY] = useState(0)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const debounceTimer = useRef<NodeJS.Timeout>()

  const updateScrollDirection = useCallback(() => {
    const currentScrollY = window.scrollY

    if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
      ticking.current = false
      return
    }

    const newDirection: ScrollDirection = 
      currentScrollY > lastScrollY.current ? 'down' : 'up'
    
    setScrollDirection(newDirection)
    setScrollY(currentScrollY)
    lastScrollY.current = currentScrollY
    ticking.current = false
  }, [threshold])

  const handleScroll = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking.current = true
      }
    }, debounce)
  }, [updateScrollDirection, debounce])

  useEffect(() => {
    if (typeof window === 'undefined') {return}

    lastScrollY.current = window.scrollY
    setScrollY(window.scrollY)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [handleScroll])

  return { scrollDirection, scrollY }
}

// Keep original name as alias for backwards compatibility
export const useScrollDirection = useScrollBehavior

export default useScrollBehavior

