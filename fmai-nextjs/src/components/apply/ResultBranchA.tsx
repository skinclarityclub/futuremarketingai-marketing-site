'use client'

import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import { useApplyWizard } from '@/lib/apply/store'
import { ApplyCalendlyInline } from '@/components/interactive/ApplyCalendlyInline'

/**
 * Result Branch A — qualified (score >= 7).
 * Show inline Calendly + prefill name/email.
 */
export function ResultBranchA() {
  const t = useTranslations('apply.wizard.result.qualified')
  const identity = useApplyWizard((s) => s.identity)

  return (
    <div className="space-y-8">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-system/10 border border-accent-system/30 rounded-full text-sm font-mono uppercase tracking-[0.16em] text-accent-system">
          <Sparkles className="h-3 w-3" aria-hidden />
          {t('eyebrow')}
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-display text-text-primary">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </header>

      <ApplyCalendlyInline name={identity.name} email={identity.email} />

      <p className="text-center text-sm text-text-muted">
        {t('reassurance')}
      </p>
    </div>
  )
}
