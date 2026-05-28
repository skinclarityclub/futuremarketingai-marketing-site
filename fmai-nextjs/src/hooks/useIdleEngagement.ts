'use client'

import { useEffect, useState } from 'react'
import { usePathname } from '@/i18n/navigation'

export type IdleStage = 'rest' | 'noticed' | 'whispering'

interface IdleEngagementOptions {
  /** Seconds of scroll-stilness before reaching `noticed`. Default 8s. */
  noticedAfterMs?: number
  /** Seconds of scroll-stilness before reaching `whispering`. Default 20s. */
  whisperingAfterMs?: number
  /** How long the `whispering` stage stays visible before auto-fading back to `noticed`. Default 6s. */
  whisperHoldMs?: number
}

/**
 * useIdleEngagement -- progressive attention escalator for Clyde's
 * presence on the page. Default behaviour mirrors the character-brief's
 * "senior colleague in your peripheral vision" pattern:
 *   - 0-8s scrolling/active: rest (silent presence)
 *   - 8-20s idle: noticed (one amber-notch glint)
 *   - 20s+ idle: whispering (page-aware one-liner appears)
 *   - whisper auto-folds back to noticed after 6s
 *
 * Resets to rest on every scroll event and on route change. Listener is
 * passive so it never blocks the scroll thread. Timeouts are scheduled
 * via the standard window queue -- requestIdleCallback isn't available
 * everywhere (Safari) so we accept ~16ms TBT cost on the timer fires.
 */
export function useIdleEngagement(options: IdleEngagementOptions = {}): IdleStage {
  const {
    noticedAfterMs = 8_000,
    whisperingAfterMs = 20_000,
    whisperHoldMs = 6_000,
  } = options

  const pathname = usePathname()
  const [stage, setStage] = useState<IdleStage>('rest')

  useEffect(() => {
    if (typeof window === 'undefined') return

    let noticedTimer: number | undefined
    let whisperTimer: number | undefined
    let holdTimer: number | undefined

    const clearAll = () => {
      if (noticedTimer !== undefined) window.clearTimeout(noticedTimer)
      if (whisperTimer !== undefined) window.clearTimeout(whisperTimer)
      if (holdTimer !== undefined) window.clearTimeout(holdTimer)
    }

    const schedule = () => {
      clearAll()
      setStage('rest')
      noticedTimer = window.setTimeout(() => setStage('noticed'), noticedAfterMs)
      whisperTimer = window.setTimeout(() => {
        setStage('whispering')
        holdTimer = window.setTimeout(() => setStage('noticed'), whisperHoldMs)
      }, whisperingAfterMs)
    }

    const handleActivity = () => schedule()

    schedule()
    window.addEventListener('scroll', handleActivity, { passive: true })
    window.addEventListener('pointerdown', handleActivity, { passive: true })
    window.addEventListener('keydown', handleActivity, { passive: true })

    return () => {
      clearAll()
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('pointerdown', handleActivity)
      window.removeEventListener('keydown', handleActivity)
    }
    // pathname in deps so route-changes reset the idle clock
  }, [pathname, noticedAfterMs, whisperingAfterMs, whisperHoldMs])

  return stage
}
