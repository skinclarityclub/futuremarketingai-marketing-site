'use client'

import { Check } from 'lucide-react'
import { motion } from 'motion/react'

interface OptionButtonProps {
  letter: 'a' | 'b' | 'c' | 'd'
  label: string
  selected: boolean
  onClick: () => void
}

export function OptionButton({ letter, label, selected, onClick }: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`group relative flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${
        selected
          ? 'border-accent-system bg-accent-system/[0.06] shadow-[0_0_0_1px_var(--color-accent-system)]'
          : 'border-border-primary bg-white/[0.02] hover:border-border-secondary hover:bg-white/[0.04]'
      }`}
      aria-pressed={selected}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
          selected
            ? 'border-accent-system bg-accent-system text-bg-deep'
            : 'border-border-primary bg-bg-elevated text-text-secondary group-hover:text-text-primary'
        }`}
        aria-hidden="true"
      >
        {selected ? <Check className="h-4 w-4" /> : letter.toUpperCase()}
      </span>
      <span className="text-sm leading-relaxed text-text-primary md:text-base">{label}</span>
    </motion.button>
  )
}
