'use client'

import { useEffect, useId, useState, type Dispatch, type SetStateAction } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useChatbotStore } from '@/stores/chatbotStore'
import { clearMemory } from '@/lib/chatbot/memory-persistence'

/**
 * CookieConsentBanner — first-party AVG/GDPR consent UI.
 *
 * Replaces the legacy react-cookie-consent dependency (Phase 17-C C3).
 * Differences from the old banner:
 *  - Granular toggles for functional / analytics / marketing categories.
 *  - Three actions: Accept all · Save selection · Reject all.
 *  - Stores per-category booleans in `localStorage[cookieConsent]`, not a
 *    single document.cookie. Easier to audit and survives Safari ITP.
 *  - WCAG: focus-visible 2px ring on every interactive element, 4.5:1
 *    contrast on every button surface, role="dialog" + aria-modal="false"
 *    + aria-labelledby for screen readers.
 *  - Re-openable from the footer via the `fmai:cookie-reopen` window event.
 *
 * Banner sits at bottom of the viewport (`position: fixed`) with z-9999
 * above other floating elements. Bottom-sheet position avoids overlapping
 * the hero CTA on any standard viewport.
 */

const CONSENT_KEY = 'cookieConsent'
const REOPEN_EVENT = 'fmai:cookie-reopen'

interface ConsentState {
  functional: true
  analytics: boolean
  marketing: boolean
}

function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ConsentState>
    if (!parsed || typeof parsed !== 'object') return null
    return {
      functional: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    return null
  }
}

function writeConsent(state: ConsentState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
  } catch {
    // Storage may be disabled (private mode, quota). The user will simply be
    // prompted again on next page load — fine, the alternative is to crash.
  }
}

export function CookieConsentBanner() {
  const t = useTranslations('common.cookie_consent')
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const resetMemory = useChatbotStore((s) => s.resetMemory)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    // Mount-time sync of external (localStorage) state into React. Cannot
    // use useSyncExternalStore here because localStorage has no subscribe
    // event for cross-tab writes we care about, and the banner is a
    // hydration-only UI surface.
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true)
    const existing = readConsent()
    setOpen(existing === null)
    if (existing) {
      setAnalytics(existing.analytics)
      setMarketing(existing.marketing)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    function handleReopen() {
      const existing = readConsent()
      if (existing) {
        setAnalytics(existing.analytics)
        setMarketing(existing.marketing)
      }
      setExpanded(true)
      setOpen(true)
    }
    window.addEventListener(REOPEN_EVENT, handleReopen)
    return () => window.removeEventListener(REOPEN_EVENT, handleReopen)
  }, [])

  if (!mounted || !open) return null

  const acceptAll = () => {
    writeConsent({ functional: true, analytics: true, marketing: true })
    setAnalytics(true)
    setMarketing(true)
    setOpen(false)
  }
  const saveSelection = () => {
    writeConsent({ functional: true, analytics, marketing })
    setOpen(false)
  }
  const rejectAll = () => {
    writeConsent({ functional: true, analytics: false, marketing: false })
    // The visitor rejected non-essential storage, so also forget what Clyde
    // remembered. resetMemory() empties the store (the persist-on-change effect then
    // removes the clyde:memory key); clearMemory() covers the case where the chat
    // island has not mounted yet so that effect would not fire.
    resetMemory()
    clearMemory()
    setAnalytics(false)
    setMarketing(false)
    setOpen(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-x-0 bottom-0 z-[9999] border-t border-border-primary bg-bg-deep px-4 py-5 sm:px-6 sm:py-6 shadow-[0_-12px_40px_rgba(0,0,0,0.4)]"
    >
      <div className="max-w-5xl mx-auto">
        <h2 id={titleId} className="text-base font-semibold text-text-primary mb-1">
          {t('title')}
        </h2>
        <p id={descId} className="text-sm text-text-secondary leading-relaxed mb-4">
          {t('description')}{' '}
          <Link
            href="/legal/cookies"
            className="text-accent-system underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
          >
            {t('readMore')}
          </Link>
        </p>

        {expanded && (
          <fieldset className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 border-0 p-0">
            <legend className="sr-only">{t('customise')}</legend>
            <CategoryToggle
              label={t('categories.functional.name')}
              description={t('categories.functional.description')}
              checked
              onChange={null}
            />
            <CategoryToggle
              label={t('categories.analytics.name')}
              description={t('categories.analytics.description')}
              checked={analytics}
              onChange={setAnalytics}
            />
            <CategoryToggle
              label={t('categories.marketing.name')}
              description={t('categories.marketing.description')}
              checked={marketing}
              onChange={setMarketing}
            />
          </fieldset>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
          {!expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-sm font-medium text-text-secondary hover:text-text-primary px-4 py-2 rounded-[var(--radius-btn)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-colors"
            >
              {t('customise')}
            </button>
          ) : null}
          <button
            type="button"
            onClick={rejectAll}
            className="text-sm font-medium text-text-primary bg-white/[0.06] border border-border-primary hover:bg-white/[0.10] px-4 py-2 rounded-[var(--radius-btn)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-colors"
          >
            {t('decline')}
          </button>
          {expanded && (
            <button
              type="button"
              onClick={saveSelection}
              className="text-sm font-medium text-text-primary bg-white/[0.06] border border-border-primary hover:bg-white/[0.10] px-4 py-2 rounded-[var(--radius-btn)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-colors"
            >
              {t('saveSelection')}
            </button>
          )}
          <button
            type="button"
            onClick={acceptAll}
            className="text-sm font-semibold text-bg-deep bg-accent-system hover:brightness-110 px-5 py-2 rounded-[var(--radius-btn)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-all"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}

interface CategoryToggleProps {
  label: string
  description: string
  checked: boolean
  /** When null, the toggle is locked on (functional category). */
  onChange: Dispatch<SetStateAction<boolean>> | null
}

function CategoryToggle({ label, description, checked, onChange }: CategoryToggleProps) {
  const locked = onChange === null
  return (
    <label
      className={`relative flex items-start gap-3 p-3 rounded-[var(--radius-btn)] border border-border-primary bg-white/[0.02] ${
        locked ? 'opacity-90' : 'cursor-pointer hover:bg-white/[0.04]'
      } transition-colors`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={locked}
        aria-describedby={`${label}-desc`}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-accent-system cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system disabled:cursor-not-allowed"
      />
      <div className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-text-primary">{label}</span>
        <span id={`${label}-desc`} className="block text-xs text-text-secondary leading-snug mt-0.5">
          {description}
        </span>
      </div>
    </label>
  )
}

export default CookieConsentBanner
