'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import type { AssessmentPersona } from '@/lib/assessment/types'

interface ResultRevealProps {
  persona: AssessmentPersona
  /** Slot for the email-capture form (wave 3) — rendered below the reveal. */
  emailGate: ReactNode
}

const PERSONA_GRADIENT: Record<AssessmentPersona, string> = {
  explorer: 'linear-gradient(135deg, #60a5fa 0%, #00d4aa 100%)',
  builder: 'linear-gradient(135deg, #00d4aa 0%, #f5a623 100%)',
  operator: 'linear-gradient(135deg, #f5a623 0%, #ef4444 60%, #a855f7 100%)',
}

export function ResultReveal({ persona, emailGate }: ResultRevealProps) {
  const t = useTranslations('assessment.result')
  const tShared = useTranslations('assessment')

  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-system/30 bg-accent-system/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-system">
          <Sparkles className="h-3.5 w-3.5" />
          {tShared('result.eyebrow')}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mb-2 text-lg text-text-secondary"
      >
        {t('preTitle')}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 160, damping: 22 }}
        className="mb-6 font-display text-6xl font-black leading-none tracking-tight sm:text-7xl md:text-8xl"
      >
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: PERSONA_GRADIENT[persona] }}
        >
          {t(`${persona}.name`)}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-text-primary"
      >
        {t(`${persona}.summary`)}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5 }}
      >
        {emailGate}
      </motion.div>
    </div>
  )
}
