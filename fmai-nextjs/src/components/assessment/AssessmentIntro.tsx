'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { ArrowRight, Clock, Shield, Sparkles, UserCheck } from 'lucide-react'

interface AssessmentIntroProps {
  onStart: () => void
}

const BULLET_KEYS = ['persona', 'scores', 'skills'] as const

const TRUST_KEYS = [
  { key: 'privacy', Icon: Shield },
  { key: 'validated', Icon: UserCheck },
  { key: 'retention', Icon: Clock },
] as const

export function AssessmentIntro({ onStart }: AssessmentIntroProps) {
  const t = useTranslations('assessment.intro')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-3xl text-center"
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-system/30 bg-accent-system/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-system">
        <Sparkles className="h-3.5 w-3.5" />
        {t('eyebrow')}
      </div>

      <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
        {t('titleLead')}{' '}
        <span className="text-accent-system">{t('titleAccent')}</span>
      </h1>

      <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary">
        {t('subtitle')}
      </p>

      <ul className="mx-auto mb-8 grid max-w-xl gap-3 text-left sm:grid-cols-3">
        {BULLET_KEYS.map((key, i) => (
          <motion.li
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
            className="rounded-xl border border-border-primary bg-white/[0.02] p-4"
          >
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-accent-system">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="text-sm font-medium text-text-primary">{t(`bullets.${key}`)}</div>
          </motion.li>
        ))}
      </ul>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mx-auto mb-10 flex max-w-2xl flex-col items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted sm:flex-row sm:flex-wrap"
      >
        {TRUST_KEYS.map(({ key, Icon }) => (
          <li key={key} className="inline-flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 text-accent-system/70" aria-hidden="true" />
            <span>{t(`trust.${key}`)}</span>
          </li>
        ))}
      </motion.ul>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onStart}
          className="group inline-flex items-center gap-2.5 rounded-lg bg-accent-system px-7 py-3.5 text-base font-semibold text-bg-deep transition-all duration-500 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
          style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
        >
          {t('start')}
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bg-deep/20 transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight className="h-3 w-3" />
          </span>
        </button>
        <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
          <Clock className="h-4 w-4" />
          {t('duration')}
        </span>
      </div>
    </motion.div>
  )
}
