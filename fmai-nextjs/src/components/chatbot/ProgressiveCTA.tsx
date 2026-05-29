'use client'

import React from 'react'
import { motion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { useChatbotStore } from '@/stores/chatbotStore'
import { ApplyCtaButton } from './ApplyCtaButton'

interface ProgressiveCTAProps {
  messageCount: number
}

/**
 * ProgressiveCTA — Message-count-based progressive CTA banners.
 *
 * Threshold logic:
 * - 0-4 messages: No CTA (returns null)
 * - 5-9 messages: Subtle text banner with link
 * - 10-14 messages: Strong banner with CTA
 * - 15+ messages: Gate banner — demo limit reached
 *
 * All CTAs route to the application-gated /apply page (no Calendly, no /contact),
 * per the partnership model, via the shared ApplyCtaButton so they match the
 * site-wide CTA and close the chat on click. NL is the source of truth.
 */
export const ProgressiveCTA: React.FC<ProgressiveCTAProps> = ({ messageCount }) => {
  const close = useChatbotStore((s) => s.close)

  if (messageCount < 5) {
    return null
  }

  if (messageCount >= 15) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-6 bg-white/[0.02] border border-border-primary rounded-2xl text-center"
      >
        <p className="text-lg font-semibold text-text-primary mb-2">
          Klaar voor de volledige ervaring?
        </p>
        <p className="text-sm text-text-secondary mb-4">
          Plan een gesprek, dan bespreken we wat Clyde voor jouw bureau kan doen.
        </p>
        <ApplyCtaButton>Plan een gesprek</ApplyCtaButton>
      </motion.div>
    )
  }

  if (messageCount >= 10) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-accent-human/5 border border-accent-human/20 rounded-2xl text-center"
      >
        <p className="text-sm text-text-primary font-medium mb-3">
          Klaar om te zien wat dit voor jouw bureau kan doen?
        </p>
        <ApplyCtaButton size="sm">Plan een gesprek</ApplyCtaButton>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-3 bg-accent-system/5 border border-accent-system/20 rounded-2xl text-center"
    >
      <p className="text-sm text-text-secondary">
        Bevalt de demo?
        <Link
          href="/apply"
          onClick={() => close()}
          className="ml-1 text-accent-system hover:underline font-medium"
        >
          Leer meer over een samenwerking
        </Link>
      </p>
    </motion.div>
  )
}

export default ProgressiveCTA
