'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { CountUp } from '@/components/motion/CountUp'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { EASE_OUT } from '@/lib/motion/easings'

export interface SharedResultScore {
  key: string
  label: string
  score: number
  isLowest: boolean
}

interface SharedResultRevealProps {
  eyebrow: string
  preTitle: string
  archetypeName: string
  archetypeGradient: string
  stagePrefix: string
  stageLabel: string
  total: number
  scoresHeading: string
  focusLabel: string
  scores: readonly SharedResultScore[]
  ctaHeadline: string
  ctaButton: string
  ctaHint: string
}

/**
 * Public shareable assessment-result rendering — client component so the
 * archetype reveal, score bars and CTA can animate on mount. The server
 * page (assessment/result/page.tsx) resolves search-params to props and
 * mounts this; motion handles reduced-motion via the global MotionConfig.
 */
export function SharedResultReveal({
  eyebrow,
  preTitle,
  archetypeName,
  archetypeGradient,
  stagePrefix,
  stageLabel,
  total,
  scoresHeading,
  focusLabel,
  scores,
  ctaHeadline,
  ctaButton,
  ctaHint,
}: SharedResultRevealProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      {/* Archetype hero — animates on mount */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="mb-3 flex justify-center"
        >
          <EyebrowLabel>{eyebrow}</EyebrowLabel>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
          className="mb-2 text-lg text-text-secondary"
        >
          {preTitle}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 }}
          className="mb-4 font-display text-6xl font-black leading-none tracking-tight sm:text-7xl"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: archetypeGradient }}
          >
            {archetypeName}
          </span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.45 }}
          className="mb-4 flex items-center justify-center"
        >
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {stagePrefix} {stageLabel}
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.6 }}
          className="mb-10 font-mono text-2xl text-text-primary tabular-nums"
        >
          <CountUp to={total} duration={1.2} />
          <span className="text-text-secondary">/100</span>
        </motion.p>
      </div>

      {/* Score bars per category */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.7 }}
        className="mb-10 rounded-2xl border border-border-primary bg-white/[0.02] p-6 md:p-8"
        aria-labelledby="shared-scores"
      >
        <h2 id="shared-scores" className="mb-5 text-base font-semibold text-text-primary">
          {scoresHeading}
        </h2>
        <div className="space-y-3.5">
          {scores.map((row, i) => (
            <div key={row.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className={row.isLowest ? 'text-accent-human' : 'text-text-primary'}>
                  {row.label}
                  {row.isLowest && (
                    <span className="ml-2 inline-flex items-center rounded-full border border-accent-human/30 bg-accent-human/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-human">
                      {focusLabel}
                    </span>
                  )}
                </span>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    row.isLowest ? 'text-accent-human' : 'text-text-secondary'
                  }`}
                >
                  <CountUp to={row.score} duration={0.9} />/100
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${row.score}%` }}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.9 + i * 0.08 }}
                  className={`h-full rounded-full ${
                    row.isLowest ? 'bg-accent-human' : 'bg-accent-system'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 1.0 }}
        className="rounded-2xl border border-accent-system/30 bg-gradient-to-br from-white/[0.02] to-accent-system/[0.04] p-6 text-center md:p-8"
      >
        <p className="mb-5 text-base text-text-primary md:text-lg">{ctaHeadline}</p>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-system px-6 py-3 text-sm font-semibold text-bg-deep transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          {ctaButton}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-xs text-text-muted">{ctaHint}</p>
      </motion.div>
    </main>
  )
}
