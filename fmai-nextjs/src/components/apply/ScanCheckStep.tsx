'use client'

import { useTranslations } from 'next-intl'
import { ClipboardCheck, ListChecks } from 'lucide-react'
import { motion } from 'motion/react'
import { useApplyWizard } from '@/lib/apply/store'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { Link } from '@/i18n/navigation'

export function ScanCheckStep({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const t = useTranslations('apply.wizard')
  const assessment = useApplyWizard((s) => s.assessment)
  const setAssessment = useApplyWizard((s) => s.setAssessment)
  const scanCheckChoice = useApplyWizard((s) => s.scanCheckChoice)
  const setScanCheckChoice = useApplyWizard((s) => s.setScanCheckChoice)

  const hasDetectedScan = assessment !== null

  const choose = (choice: 'yes' | 'no') => {
    setScanCheckChoice(choice)
    if (choice === 'no') setAssessment(null)
    onNext()
  }

  return (
    <div className="space-y-6">
      <header className="text-center space-y-3">
        <EyebrowLabel>{t('scanCheck.eyebrow')}</EyebrowLabel>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary">
          {t('scanCheck.title')}
        </h2>
        <p className="text-base text-text-secondary leading-relaxed">
          {t('scanCheck.subtitle')}
        </p>
      </header>

      {hasDetectedScan ? (
        <div className="rounded-[var(--radius-card)] border border-accent-system/30 bg-accent-system/[0.04] p-5">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-2">
            {t('scanCheck.detectedTitle')}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {t('scanCheck.detectedBody')}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ChoiceCard
          icon={ClipboardCheck}
          label={t('scanCheck.yesLabel')}
          body={t('scanCheck.yesBody')}
          selected={scanCheckChoice === 'yes'}
          onClick={() => choose('yes')}
          accent="system"
          disabled={!hasDetectedScan}
        />
        <ChoiceCard
          icon={ListChecks}
          label={t('scanCheck.noLabel')}
          body={t('scanCheck.noBody')}
          selected={scanCheckChoice === 'no'}
          onClick={() => choose('no')}
          accent="human"
        />
      </div>

      {!hasDetectedScan ? (
        <p className="text-center text-xs text-text-muted">
          {t('scanCheck.missingDataPrompt')}{' '}
          <Link href="/assessment" className="text-accent-system underline">
            {t('scanCheck.rescanLink')}
          </Link>
        </p>
      ) : null}

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          ← {t('progress.previous')}
        </button>
      </div>
    </div>
  )
}

interface ChoiceCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  body: string
  selected: boolean
  onClick: () => void
  accent: 'system' | 'human'
  disabled?: boolean
}

function ChoiceCard({ icon: Icon, label, body, selected, onClick, accent, disabled }: ChoiceCardProps) {
  const accentColor = accent === 'human' ? 'accent-human' : 'accent-system'
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -3 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`relative rounded-[var(--radius-card)] border p-6 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        selected
          ? `border-${accentColor} bg-${accentColor}/[0.06]`
          : 'border-border-primary bg-white/[0.02] hover:border-border-secondary hover:bg-white/[0.04]'
      }`}
    >
      <Icon className={`h-7 w-7 mb-3 text-${accentColor}`} aria-hidden />
      <h3 className="text-base font-semibold text-text-primary mb-1">{label}</h3>
      <p className="text-xs text-text-secondary leading-relaxed">{body}</p>
    </motion.button>
  )
}
