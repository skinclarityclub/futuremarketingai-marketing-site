'use client'

import { motion } from 'motion/react'

interface LikertScaleProps {
  value: 1 | 2 | 3 | 4 | 5 | undefined
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void
  minLabel: string
  maxLabel: string
}

const VALUES: ReadonlyArray<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5]

export function LikertScale({ value, onChange, minLabel, maxLabel }: LikertScaleProps) {
  return (
    <div className="space-y-3">
      <div
        role="radiogroup"
        aria-label="Likert schaal van 1 tot 5"
        className="flex items-center justify-between gap-2 sm:gap-3"
      >
        {VALUES.map((v) => {
          const selected = value === v
          return (
            <motion.button
              key={v}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${v} van 5`}
              onClick={() => onChange(v)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl border text-base font-semibold transition-colors sm:h-14 sm:w-14 sm:text-lg ${
                selected
                  ? 'border-accent-system bg-accent-system text-bg-deep shadow-[0_0_24px_-6px_var(--color-accent-system)]'
                  : 'border-border-primary bg-white/[0.02] text-text-secondary hover:border-border-secondary hover:bg-white/[0.04] hover:text-text-primary'
              }`}
            >
              {v}
            </motion.button>
          )
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
