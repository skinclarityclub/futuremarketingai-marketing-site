'use client'

import React from 'react'
import { motion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { useChatbotStore } from '@/stores/chatbotStore'

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
 */
export const ProgressiveCTA: React.FC<ProgressiveCTAProps> = ({ messageCount }) => {
  const { openCalendly } = useChatbotStore()

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
        className="mt-4 p-6 bg-white/[0.02] border border-border-primary rounded-2xl text-center"
      >
        <p className="text-lg font-semibold text-text-primary mb-2">
          Want to see the full experience?
        </p>
        <p className="text-sm text-text-secondary mb-4">
          Book a discovery call to explore all capabilities.
        </p>
        <button
          type="button"
          onClick={() => openCalendly()}
          className="inline-block rounded-xl bg-gradient-to-r from-accent-system to-accent-secondary px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
        >
          Book a Discovery Call
        </button>
      </motion.div>
    )
  }

  // Strong banner (10-14 messages) — CTA
  if (messageCount >= 10) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-accent-human/5 border border-accent-human/20 rounded-2xl text-center"
      >
        <p className="text-sm text-text-primary font-medium mb-3">
          Ready to see what this can do for your business?
        </p>
        <button
          type="button"
          onClick={() => openCalendly()}
          className="inline-block rounded-xl bg-gradient-to-r from-accent-system to-accent-secondary px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
        >
          Schedule a Demo
        </button>
      </motion.div>
    )
  }

  // Subtle banner (5-9 messages) — text link
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-3 bg-accent-system/5 border border-accent-system/20 rounded-2xl text-center"
    >
      <p className="text-sm text-text-secondary">
        Enjoying the demo?
        <Link
          href="/contact"
          className="ml-1 text-accent-system hover:underline font-medium cursor-pointer"
        >
          Learn more about our chatbot solutions
        </Link>
      </p>
    </motion.div>
  )
}

export default ProgressiveCTA
