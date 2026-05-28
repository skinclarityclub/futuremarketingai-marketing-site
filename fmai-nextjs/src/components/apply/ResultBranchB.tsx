'use client'

import { useTranslations } from 'next-intl'
import { Mail, Clock, MessageSquare } from 'lucide-react'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'

/**
 * Result Branch B — review (score < 7).
 * Soft "Daley reviewt persoonlijk" message, geen Calendly.
 */
export function ResultBranchB() {
  const t = useTranslations('apply.wizard.result.review')

  const steps = [
    { icon: Clock, body: t('nextStep1') },
    { icon: Mail, body: t('nextStep2') },
    { icon: MessageSquare, body: t('nextStep3') },
  ]

  return (
    <div className="space-y-8">
      <header className="text-center space-y-4">
        <EyebrowLabel>{t('eyebrow')}</EyebrowLabel>
        <h2 className="text-3xl md:text-5xl font-bold font-display text-text-primary">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </header>

      <div className="rounded-[var(--radius-card)] border border-border-primary bg-bg-surface/30 p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-4">
          {t('nextLabel')}
        </p>
        <ol className="space-y-4">
          {steps.map(({ icon: Icon, body }, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-system/10 text-accent-system">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <p className="text-sm leading-relaxed text-text-primary pt-1.5">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
