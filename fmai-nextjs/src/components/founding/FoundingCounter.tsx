import { getLocale, getTranslations } from 'next-intl/server'
import {
  FOUNDING_SPOTS_TOTAL,
  FOUNDING_COHORT_START,
} from '@/lib/constants'

/**
 * FoundingCounter
 *
 * WHY: shows the founding cap ("maximaal 10 founding-plekken") and, while it is still
 * ahead, the cohort start. No taken count: no founding org pays yet (Daley 2026-10-12).
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

  // A cohort start that has already passed reads as an abandoned page: on
  // 2026-09-01 this badge still advertised "Cohort start 1 juni 2026". Scarcity
  // that is visibly expired argues against you. Hide the line once the date is
  // behind us; set a future FOUNDING_COHORT_START and it returns by itself.
  const cohortStartsInFuture = new Date(FOUNDING_COHORT_START) > new Date()
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
          total: FOUNDING_SPOTS_TOTAL,
        })}
      </span>
      {cohortStartsInFuture && (
        <span className="text-xs text-text-muted">
          {t('cohortStart', { date: cohortStartLabel })}
        </span>
      )}
    </div>
  )
}
