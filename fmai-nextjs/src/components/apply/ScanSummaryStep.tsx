'use client'

import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import { useApplyWizard } from '@/lib/apply/store'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { ApplyOptionButton } from './ApplyOptionButton'
import { Link } from '@/i18n/navigation'
import type { TierKey, UrgencyKey } from '@/lib/apply/types'

const TIER_KEYS: TierKey[] = ['founding', 'growth', 'professional', 'enterprise', 'unsure']
const URGENCY_KEYS: UrgencyKey[] = ['30days', 'quarter', 'explore', 'unknown']

/**
 * Step 3b — scan-handoff summary + condensed Q1 + Q5 (still needed for scoring).
 * Replaces full QualificationStep (Q2/Q3/Q4) — assessment data provides stage baseline.
 */
export function ScanSummaryStep({
  onPrev,
  onNext,
}: {
  onPrev: () => void
  onNext: () => void
}) {
  const t = useTranslations('apply.wizard')
  const tForm = useTranslations('apply.form')
  const assessment = useApplyWizard((s) => s.assessment)
  const qualification = useApplyWizard((s) => s.qualification)
  const setQualification = useApplyWizard((s) => s.setQualification)

  if (!assessment) {
    return (
      <div className="text-center space-y-4">
        <p className="text-text-secondary">{t('scanCheck.missingDataPrompt')}</p>
        <Link
          href="/assessment"
          className="inline-block text-sm text-accent-system underline"
        >
          {t('scanCheck.rescanLink')}
        </Link>
      </div>
    )
  }

  const canContinue = !!qualification.q1 && !!qualification.q5

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <EyebrowLabel>{t('scanSummary.eyebrow')}</EyebrowLabel>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary">
          {t('scanSummary.title')}
        </h2>
        <p className="text-base text-text-secondary leading-relaxed">
          {t('scanSummary.subtitle')}
        </p>
      </header>

      {/* Scan summary card */}
      <div className="rounded-[var(--radius-card)] border border-accent-system/30 bg-gradient-to-br from-accent-system/[0.08] via-accent-system/[0.03] to-transparent p-6">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-accent-system shrink-0" aria-hidden />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryField label={t('scanSummary.stageLabel')} value={assessment.stage} />
            <SummaryField label={t('scanSummary.archetypeLabel')} value={assessment.archetype} />
            <SummaryField label={t('scanSummary.lowestLabel')} value={assessment.lowestCategory} />
          </div>
        </div>
        <Link
          href="/assessment"
          className="text-xs text-text-muted hover:text-text-secondary underline transition-colors"
        >
          {t('scanSummary.rescanLabel')}
        </Link>
      </div>

      {/* Q1 — Tier (still asked) */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary">
          {t('qualification.q1Title')}
        </h3>
        <p className="text-xs text-text-muted">{t('qualification.q1Help')}</p>
        <div className="space-y-2">
          {TIER_KEYS.map((key) => (
            <ApplyOptionButton
              key={key}
              label={tForm(`tierOptions.${key}`)}
              selected={qualification.q1 === key}
              onClick={() => setQualification({ q1: key })}
            />
          ))}
        </div>
      </div>

      {/* Q5 — Urgency (still asked) */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary">
          {t('qualification.q5Title')}
        </h3>
        <div className="space-y-2">
          {URGENCY_KEYS.map((key) => (
            <ApplyOptionButton
              key={key}
              label={t(`qualification.q5Options.${key}`)}
              selected={qualification.q5 === key}
              onClick={() => setQualification({ q5: key })}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          ← {t('progress.previous')}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-system text-bg-deep font-semibold rounded-[var(--radius-btn)] hover:brightness-110 transition-[filter] text-sm disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          {t('progress.next')} →
        </button>
      </div>
    </div>
  )
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-text-primary capitalize">{value}</p>
    </div>
  )
}
