'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useApplyWizard } from '@/lib/apply/store'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { ApplyOptionButton } from './ApplyOptionButton'
import { LikertScale } from '@/components/assessment/LikertScale'
import type {
  TierKey,
  RevenueKey,
  ClientCountKey,
  UrgencyKey,
  LikertValue,
} from '@/lib/apply/types'

const TIER_KEYS: TierKey[] = ['founding', 'growth', 'professional', 'enterprise', 'unsure']
const REVENUE_KEYS: RevenueKey[] = ['under_300k', '300k_1m', '1m_3m', '3m_10m', 'over_10m']
const CLIENT_COUNT_KEYS: ClientCountKey[] = ['solo', '1_5', '5_15', '15_50', 'over_50']
const URGENCY_KEYS: UrgencyKey[] = ['30days', 'quarter', 'explore', 'unknown']

export function QualificationStep({
  onPrev,
  onNext,
}: {
  onPrev: () => void
  onNext: () => void
}) {
  const t = useTranslations('apply.wizard')
  const tForm = useTranslations('apply.form')
  const qualification = useApplyWizard((s) => s.qualification)
  const setQualification = useApplyWizard((s) => s.setQualification)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = () => {
    if (!qualification.q1) return setError(t('errors.q1Required'))
    if (!qualification.q2) return setError(t('errors.q2Required'))
    if (!qualification.q3) return setError(t('errors.q3Required'))
    if (!qualification.q4) return setError(t('errors.q4Required'))
    if (!qualification.q5) return setError(t('errors.q5Required'))
    setError(null)
    onNext()
  }

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <EyebrowLabel>{t('qualification.eyebrow')}</EyebrowLabel>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary">
          {t('qualification.title')}
        </h2>
        <p className="text-base text-text-secondary leading-relaxed">
          {t('qualification.subtitle')}
        </p>
      </header>

      {/* Q1 — Tier */}
      <QuestionBlock
        number={1}
        title={t('qualification.q1Title')}
        help={t('qualification.q1Help')}
      >
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
      </QuestionBlock>

      {/* Q2 — Revenue */}
      <QuestionBlock number={2} title={t('qualification.q2Title')}>
        <div className="space-y-2">
          {REVENUE_KEYS.map((key) => (
            <ApplyOptionButton
              key={key}
              label={tForm(`revenueOptions.${key}`)}
              selected={qualification.q2 === key}
              onClick={() => setQualification({ q2: key })}
            />
          ))}
        </div>
      </QuestionBlock>

      {/* Q3 — Client count */}
      <QuestionBlock number={3} title={t('qualification.q3Title')}>
        <div className="space-y-2">
          {CLIENT_COUNT_KEYS.map((key) => (
            <ApplyOptionButton
              key={key}
              label={tForm(`clientCountOptions.${key}`)}
              selected={qualification.q3 === key}
              onClick={() => setQualification({ q3: key })}
            />
          ))}
        </div>
      </QuestionBlock>

      {/* Q4 — Likert AI maturity */}
      <QuestionBlock number={4} title={t('qualification.q4Title')}>
        <LikertScale
          value={qualification.q4}
          onChange={(v) => setQualification({ q4: v as LikertValue })}
          minLabel={t('qualification.q4Anchors.low')}
          maxLabel={t('qualification.q4Anchors.high')}
        />
      </QuestionBlock>

      {/* Q5 — Urgency */}
      <QuestionBlock number={5} title={t('qualification.q5Title')}>
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
      </QuestionBlock>

      {error ? <p className="text-sm text-error text-center">{error}</p> : null}

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
          onClick={onSubmit}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-system text-bg-deep font-semibold rounded-[var(--radius-btn)] hover:brightness-110 transition-[filter] text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          {t('progress.next')} →
        </button>
      </div>
    </div>
  )
}

interface QuestionBlockProps {
  number: number
  title: string
  help?: string
  children: React.ReactNode
}

function QuestionBlock({ number, title, help, children }: QuestionBlockProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-system">
          {String(number).padStart(2, '0')}
        </span>
        <h3 className="text-lg font-semibold text-text-primary leading-snug">{title}</h3>
      </div>
      {help ? <p className="text-xs text-text-muted">{help}</p> : null}
      {children}
    </div>
  )
}
