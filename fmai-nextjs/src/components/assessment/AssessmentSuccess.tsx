'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'

export function AssessmentSuccess() {
  const t = useTranslations('assessment.success')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl rounded-2xl border border-accent-system/30 bg-gradient-to-br from-white/[0.03] to-accent-system/[0.05] p-8 text-center md:p-12"
    >
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-system/15 text-accent-system">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="mb-3 text-2xl font-semibold text-text-primary md:text-3xl">{t('title')}</h2>
      <p className="mx-auto max-w-md text-base leading-relaxed text-text-secondary">{t('body')}</p>
    </motion.div>
  )
}
