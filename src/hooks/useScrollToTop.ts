import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * useScrollToTop - Hook to scroll to top on route change
 *
 * Automatically scrolls to top with smooth animation
 * whenever the route changes.
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [pathname])
}

export default useScrollToTop
