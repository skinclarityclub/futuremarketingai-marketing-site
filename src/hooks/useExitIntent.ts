import { useEffect, useState, useCallback } from 'react'
import { useLocalStorage } from 'react-use'

/**
 * useExitIntent - Detect when user intends to leave the page
 *
 * Features:
 * - Mouse movement tracking
 * - Show once per session
 * - Configurable sensitivity
 * - Mobile-friendly (disabled on mobile)
 */
export const useExitIntent = (options: {
  onExitIntent: () => void
  sensitivity?: number
  enabled?: boolean
}) => {
  const { onExitIntent, sensitivity = 20, enabled = true } = options
  const [hasShown, setHasShown] = useLocalStorage('exit-intent-shown', false)
  const [isTriggered, setIsTriggered] = useState(false)

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      // Only trigger if mouse leaves from top (close to browser controls)
      if (e.clientY <= sensitivity && !hasShown && !isTriggered) {
        setIsTriggered(true)
        setHasShown(true)
        onExitIntent()
      }
    },
    [hasShown, isTriggered, sensitivity, onExitIntent, setHasShown]
  )

  useEffect(() => {
    // Disable on mobile
    if (typeof window === 'undefined' || !enabled || hasShown) {
      return
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      return
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enabled, hasShown, handleMouseLeave])

  return {
    isTriggered,
    reset: () => {
      setIsTriggered(false)
      setHasShown(false)
    },
  }
}

export default useExitIntent
