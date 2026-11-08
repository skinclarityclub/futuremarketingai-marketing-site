'use client'

import { useEffect, useState } from 'react'
import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'
import type { IdleStage } from '@/hooks/useIdleEngagement'

interface ClydePresenceProps {
  onClick: () => void
  /** Page-aware micro-copy shown when idleStage === 'whispering'. */
  whisper: string
  /** Drives notch animation + whisper visibility. */
  idleStage: IdleStage
  /** Whether there are unread messages; renders a small dot when true. */
  hasUnread?: boolean
  /** useFabQuiet: true = round mark only, null = not measured yet (CSS decides). */
  quiet: boolean | null
}

/**
 * ClydePresence -- the chat entry-point on every page.
 *
 * The round sparkle mark, without a wordmark, on every page (Daley 2026-11-08: "standaard overal stille
 * modes, alleen open klappen bij berichten vanuit Clyde"). It only widens into a pill when Clyde says
 * something on the site:
 *   - On 20s scroll-idle: page-aware whisper (see widget-copy.ts)
 *
 * Mobile: lifts above the cookie banner while no consent is stored,
 * hides while the on-screen keyboard is open.
 *
 * Over hero 3 and the week (`[data-fab-quiet]`) the whisper waits (`data-quiet`, K1 B, website-port PR 3),
 * so even the pill never covers the scenes.
 */
export function ClydePresence({
  onClick,
  whisper,
  idleStage,
  hasUnread = false,
  quiet,
}: ClydePresenceProps) {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    const vv = window.visualViewport
    const handler = () => {
      const shrunk = vv.height < window.innerHeight * 0.75
      setKeyboardOpen(shrunk)
    }
    vv.addEventListener('resize', handler)
    return () => vv.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const check = () => {
      try {
        setCookieBannerVisible(window.localStorage.getItem('cookieConsent') === null)
      } catch {
        setCookieBannerVisible(true)
      }
    }
    check()
    window.addEventListener('storage', check)
    const interval = window.setInterval(check, 1500)
    return () => {
      window.removeEventListener('storage', check)
      window.clearInterval(interval)
    }
  }, [])

  const isWhispering = idleStage === 'whispering' && whisper.length > 0
  const ariaLabel = `Open chat met Clyde${isWhispering ? `: ${whisper}` : ''}`

  // Lift clear of the cookie banner until consent is recorded. The banner is
  // fixed bottom-0 z-[9999] and ~154px tall on desktop, so the old lg:bottom-24
  // (96px) left the FAB *inside* the banner — the banner intercepted the open
  // click and a first-time desktop visitor could not open Clyde. Lift to
  // lg:bottom-44 (176px) to clear the collapsed banner, and raise the FAB above
  // the banner's z-index as a safety net for the taller expanded banner.
  // Resting position lifts above the mobile sticky-CTA bar via `.fab-rest`
  // (reads --fab-safe-bottom; collapses to bottom-6/lg:bottom-8 when no bar).
  const bottomClass = cookieBannerVisible ? 'bottom-80 lg:bottom-44' : 'fab-rest'
  const zClass = cookieBannerVisible ? 'z-[10000]' : 'z-40'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      data-hidden={keyboardOpen}
      data-stage={idleStage}
      data-quiet={quiet ?? undefined}
      data-clyde-launcher
      className={`clyde-fab group fixed right-6 ${bottomClass} ${zClass} inline-flex h-11 items-center rounded-full border border-accent-system/40 bg-bg-elevated/95 px-[10px] text-text-primary backdrop-blur-md transition-[bottom,box-shadow,transform] duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-system data-[hidden=true]:pointer-events-none data-[hidden=true]:opacity-0`}
      style={{ boxShadow: 'var(--shadow-glow)' }}
    >
      <LogoSynapse size={22} ariaLabel="" />
      {/* Mounted while a whisper is allowed, so the stage change can transition it; an
          element inserted in the same commit as data-stage would start at its end state. */}
      {whisper.length > 0 && (
        <span
          className="clyde-status overflow-hidden whitespace-nowrap text-sm text-text-secondary"
          aria-hidden={!isWhispering}
        >
          <span className="clyde-status-inner pl-2 pr-1">{whisper}</span>
        </span>
      )}
      {hasUnread && (
        <span
          aria-hidden="true"
          data-unread
          className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-error"
        >
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-error opacity-60" />
        </span>
      )}
    </button>
  )
}
