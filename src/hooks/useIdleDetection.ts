import { useEffect, useState, useRef } from 'react'

/**
 * Configuration options for idle detection
 */
export interface UseIdleDetectionOptions {
  /** Timeout in milliseconds before considered idle (default: 2000ms) */
  timeout?: number
  /** Events to listen for user activity */
  events?: string[]
}

/**
 * Custom hook for detecting user idle state
 * Useful for triggering idle animations when user is inactive
 *
 * @param options - Configuration options
 * @returns Boolean indicating if user is idle
 *
 * @example
 * ```tsx
 * function Component() {
 *   const isIdle = useIdleDetection({ timeout: 3000 })
 *
 *   return (
 *     <div className={isIdle ? 'idle-state' : 'active-state'}>
 *       {isIdle ? 'User is idle' : 'User is active'}
 *     </div>
 *   )
 * }
 * ```
 */
export function useIdleDetection(options: UseIdleDetectionOptions = {}): boolean {
  const { timeout = 2000, events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'] } =
    options

  const [isIdle, setIsIdle] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Reset idle timer
    const resetTimer = () => {
      setIsIdle(false)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true)
      }, timeout)
    }

    // Initial timer setup
    resetTimer()

    // Add event listeners for all specified events
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true })
    })

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [timeout, events])

  return isIdle
}

/**
 * Hook variant that returns idle time (ms since last activity)
 * Useful for gradual animations based on idle duration
 *
 * @param updateInterval - How often to update idle time in ms (default: 100ms)
 * @returns Idle time in milliseconds
 *
 * @example
 * ```tsx
 * function Component() {
 *   const idleTime = useIdleTime()
 *   const opacity = Math.min(idleTime / 5000, 1) // Fade in over 5 seconds
 *
 *   return <div style={{ opacity }}>Idle animation</div>
 * }
 * ```
 */
export function useIdleTime(updateInterval = 100): number {
  const [idleTime, setIdleTime] = useState(0)
  const lastActivityRef = useRef(Date.now())
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Reset activity timestamp
    const resetActivity = () => {
      lastActivityRef.current = Date.now()
      setIdleTime(0)
    }

    // Update idle time periodically
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current
      setIdleTime(elapsed)
    }, updateInterval)

    // Listen for user activity
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((event) => {
      window.addEventListener(event, resetActivity, { passive: true })
    })

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetActivity)
      })
    }
  }, [updateInterval])

  return idleTime
}
