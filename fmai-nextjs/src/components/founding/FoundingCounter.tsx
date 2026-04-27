import { getLocale, getTranslations } from 'next-intl/server'
import {
  FOUNDING_SPOTS_TAKEN,
  FOUNDING_SPOTS_TOTAL,
  FOUNDING_LAST_UPDATED,
  FOUNDING_COHORT_START,
} from '@/lib/constants'

/**
 * FoundingCounter
 *
 * WHY: audit 03 leak #5 — the bare "1 van 10 plekken bezet" counter reads as
 * fabricated urgency. Adding a date-stamp ("stand van 24 april 2026") and a
 * cohort-start ("cohort start 1 juni 2026") makes the scarcity claim concrete
 * and verifiable.
 *
 * Renders three lines:
 *   1. badge   — "1 van 10 founding plekken vergeven" (interpolated)
 *   2. updated — "Stand van 24 april 2026"
 *   3. cohort  — "Cohort start 1 juni 2026"
 *
 * Locale-aware date formatting via Intl.DateTimeFormat.
 *
 * Variants:
 *   - "warm" (default) — amber accent for hero placements (founding-member, pricing).
 *   - "system"          — teal accent for neutral placements.
 *
 * The component is server-only (uses next-intl/server). Server-only is fine
 * because all consuming pages are SSG.
 */

interface FoundingCounterProps {
  variant?: 'warm' | 'system'
  className?: string
}

const LOCALE_TO_INTL: Record<string, string> = {
  nl: 'nl-NL',
  en: 'en-GB',
  es: 'es-ES',
}

function formatDate(isoDate: string, locale: string): string {
  const intlLocale = LOCALE_TO_INTL[locale] ?? 'en-GB'
  return new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoDate))
}

export async function FoundingCounter({
  variant = 'warm',
  className = '',
}: FoundingCounterProps) {
  const locale = await getLocale()
  const t = await getTranslations('founding.counter')

  const lastUpdatedLabel = formatDate(FOUNDING_LAST_UPDATED, locale)
  const cohortStartLabel = formatDate(FOUNDING_COHORT_START, locale)

  const accentClasses =
    variant === 'warm'
      ? 'border-[#F5A623]/30 bg-[#F5A623]/10 text-[#F5A623]'
      : 'border-accent-system/40 bg-accent-system/10 text-accent-system'

  return (
    <div
      className={`inline-flex flex-col items-center gap-1 rounded-xl border px-4 py-3 text-center ${accentClasses} ${className}`.trim()}
    >
      <span className="text-sm font-semibold">
        {t('badge', {
          taken: FOUNDING_SPOTS_TAKEN,
          total: FOUNDING_SPOTS_TOTAL,
        })}
      </span>
      <span className="text-xs text-text-muted">
        {t('lastUpdated', { date: lastUpdatedLabel })}
      </span>
      <span className="text-xs text-text-muted">
        {t('cohortStart', { date: cohortStartLabel })}
      </span>
    </div>
  )
}
