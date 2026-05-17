'use client'

/**
 * LeadMagnetCTA — entry-point card for the AI Readiness Scan.
 *
 * Originally (Phase 15-04) this was a double-opt-in email-capture form. As
 * of the assessment launch (2026-05-17) it became a teaser card that pitches
 * the interactive scan and routes the visitor to /assessment, where the
 * email gate now lives at the end of the funnel (post-result, hybrid gate).
 *
 * Wired on home, pricing, founding-member, blog — same containers, same
 * `source` prop preserved for analytics + future cross-source A/B tests.
 */
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type Variant = 'inline' | 'sidebar'

export interface LeadMagnetCTAProps {
  /** Page slug for analytics + funnel-source attribution. */
  source: string
  /** Visual variant: `inline` is the larger home/blog card, `sidebar` is compact. */
  variant?: Variant
}

export function LeadMagnetCTA({ source, variant = 'inline' }: LeadMagnetCTAProps) {
  const t = useTranslations('leadMagnet')
  const locale = useLocale()

  function handleClick() {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'assessment_cta_click', { source, locale })
    }
  }

  const container =
    variant === 'sidebar'
      ? 'rounded-xl border border-border-primary bg-white/[0.02] p-5'
      : 'rounded-2xl border border-accent-system/30 bg-gradient-to-br from-white/[0.03] to-accent-system/[0.05] p-6 md:p-8'

  return (
    <aside className={container}>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent-system mb-2">
        <Sparkles className="h-4 w-4" />
        <span>{t('eyebrow')}</span>
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-text-primary mb-2">{t('title')}</h3>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">{t('subtitle')}</p>
      <ul className="space-y-1 text-sm text-text-secondary mb-5 list-disc pl-5">
        <li>{t('bullet1')}</li>
        <li>{t('bullet2')}</li>
        <li>{t('bullet3')}</li>
      </ul>
      <Link
        href={`/assessment?from=${encodeURIComponent(source)}`}
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-lg bg-accent-system px-5 py-3 text-sm font-semibold text-bg-deep transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
      >
        {t('cta')}
        <ArrowRight className="h-4 w-4" />
      </Link>
      <p className="mt-3 text-xs text-text-muted">{t('duration')}</p>
    </aside>
  )
}

export default LeadMagnetCTA
