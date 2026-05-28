'use client'

import { Check } from 'lucide-react'
import { motion } from 'motion/react'

interface ApplyOptionButtonProps {
  label: string
  /** Optional secondary description (sub-line). */
  description?: string
  selected: boolean
  onClick: () => void
}

/**
 * Variant van assessment/OptionButton zonder a-d letter constraint.
 * Voor /apply qualification waar 5-opt single-select voorkomt (tier/revenue/clientCount).
 */
export function ApplyOptionButton({
  label,
  description,
  selected,
  onClick,
}: ApplyOptionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`group relative flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${
        selected
          ? 'border-accent-system bg-accent-system/[0.06] shadow-[0_0_0_1px_var(--color-accent-system)]'
          : 'border-border-primary bg-white/[0.02] hover:border-border-secondary hover:bg-white/[0.04]'
      }`}
      aria-pressed={selected}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
          selected
            ? 'border-accent-system bg-accent-system text-bg-deep'
            : 'border-border-primary bg-bg-elevated text-text-secondary'
        }`}
        aria-hidden="true"
      >
        {selected ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
      <span className="flex-1 space-y-1">
        <span className="block text-sm font-medium leading-snug text-text-primary md:text-base">
          {label}
        </span>
        {description ? (
          <span className="block text-xs leading-relaxed text-text-secondary">
            {description}
          </span>
        ) : null}
      </span>
    </motion.button>
  )
}
