'use client'

import { motion } from 'motion/react'

interface AssessmentProgressProps {
  current: number
  total: number
  /** Localised "Vraag {current} van {total}" / "Question {current} of {total}". */
  label: string
}

export function AssessmentProgress({ current, total, label }: AssessmentProgressProps) {
  const percent = total === 0 ? 0 : Math.min(100, Math.round((current / total) * 100))

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={label}
      className="pointer-events-none fixed inset-x-0 top-16 z-30 border-b border-border-primary/60 bg-bg-deep/85 px-6 py-3 backdrop-blur-md lg:top-auto lg:bottom-[env(safe-area-inset-bottom,0px)] lg:border-b-0 lg:border-t lg:px-12"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 28 }}
            className="h-full rounded-full bg-gradient-to-r from-accent-system to-accent-human"
          />
        </div>
        <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-text-muted">
          {label}
        </span>
      </div>
    </div>
  )
}
