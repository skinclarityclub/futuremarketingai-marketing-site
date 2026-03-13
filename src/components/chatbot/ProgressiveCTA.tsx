import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CTAButton } from '../common'

interface ProgressiveCTAProps {
  messageCount: number
}

/**
 * ProgressiveCTA — Message-count-based progressive CTA banners.
 *
 * Threshold logic:
 * - 0-4 messages: No CTA (returns null)
 * - 5-9 messages: Subtle text banner with link
 * - 10-14 messages: Strong banner with Calendly CTAButton
 * - 15+ messages: Gate banner — demo limit reached, Calendly CTA
 */
export const ProgressiveCTA: React.FC<ProgressiveCTAProps> = ({ messageCount }) => {
  const { t } = useTranslation('chatbots')

  // No CTA for first 4 messages — let the demo speak for itself
  if (messageCount < 5) {
    return null
  }

  // Gate banner (15+ messages) — demo limit reached
  if (messageCount >= 15) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-6 bg-white/[0.02] border border-border-primary rounded-card text-center"
      >
        <p className="text-lg font-semibold text-text-primary mb-2">{t('demo.cta_gate_title')}</p>
        <p className="text-sm text-text-muted mb-4">{t('demo.cta_gate_description')}</p>
        <CTAButton size="md" calendly arrow>
          {t('demo.cta_gate_button')}
        </CTAButton>
      </motion.div>
    )
  }

  // Strong banner (10-14 messages) — Calendly CTA
  if (messageCount >= 10) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-accent-human/5 border border-accent-human/20 rounded-card text-center"
      >
        <p className="text-sm text-text-primary font-medium mb-3">{t('demo.cta_strong')}</p>
        <CTAButton size="sm" calendly arrow>
          {t('demo.cta_strong_button')}
        </CTAButton>
      </motion.div>
    )
  }

  // Subtle banner (5-9 messages) — text link
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-3 bg-accent-system/5 border border-accent-system/20 rounded-card text-center"
    >
      <p className="text-sm text-text-secondary">
        {t('demo.cta_subtle')}
        <a
          href="/chatbots#final-cta"
          className="ml-1 text-accent-system hover:underline font-medium cursor-pointer"
        >
          {t('demo.cta_subtle_link')}
        </a>
      </p>
    </motion.div>
  )
}

export default ProgressiveCTA
