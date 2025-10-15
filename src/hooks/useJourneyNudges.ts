/**
 * useJourneyNudges Hook
 *
 * Automatically triggers contextual nudges based on user journey progress.
 * Checks for nudge triggers periodically and updates the journey store.
 *
 * @usage
 * ```tsx
 * import { useJourneyNudges } from './hooks/useJourneyNudges'
 *
 * function MyComponent() {
 *   useJourneyNudges() // That's it! Nudges will auto-trigger
 * }
 * ```
 */

import { useEffect, useRef } from 'react'
import { useJourneyStore } from '../stores/journeyStore'
import { usePersonalizationStore } from '../stores/personalizationStore'
import { useChatStore } from '../stores/chatStore'

export function useJourneyNudges() {
  const { checkForNudges, updateTimeOnSite, recordActivity } = useJourneyStore()
  const { icpScore } = usePersonalizationStore()
  const { messages } = useChatStore()
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // Track time on site
  useEffect(() => {
    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      updateTimeOnSite(elapsed)
    }

    // Update every 5 seconds
    intervalRef.current = window.setInterval(updateTime, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [updateTimeOnSite])

  // Check for nudges periodically (reduced frequency)
  useEffect(() => {
    const checkInterval = window.setInterval(() => {
      const currentIcpScore = icpScore?.overall || 0
      const messagesCount = messages?.length || 0

      checkForNudges(currentIcpScore, messagesCount)
    }, 30000) // Check every 30 seconds (was 10)

    return () => clearInterval(checkInterval)
  }, [checkForNudges, icpScore, messages])

  // Record activity on any user interaction
  useEffect(() => {
    const handleActivity = () => {
      recordActivity()
    }

    // Listen to various activity events
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('touchstart', handleActivity)

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
    }
  }, [recordActivity])
}

/**
 * useProactiveChat Hook
 *
 * DISABLED: User feedback - prefers manual chat interaction
 *
 * Triggers proactive chat messages at optimal moments.
 * Works in conjunction with the nudge system.
 */
export function useProactiveChat() {
  // DISABLED - User prefers no automatic chat messages
  // const { isOpen, addSystemMessage } = useChatStore()
  // const { modulesViewedCount, hasUsedCalculator, timeOnSiteSeconds } = useJourneyStore()
  // const { icpScore } = usePersonalizationStore()
  // const hasShownProactive = useRef(false)
  // No-op - proactive chat disabled
}
