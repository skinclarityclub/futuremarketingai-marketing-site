'use client'

import { motion } from 'motion/react'

interface CheckpointOption {
  label: string
  action: 'next' | 'skip-to-booking' | 'end' | 'next-scenario'
}

interface DemoCheckpointProps {
  prompt: string
  options: CheckpointOption[]
  onSelect: (action: CheckpointOption['action']) => void
}

export function DemoCheckpoint({ prompt, options, onSelect }: DemoCheckpointProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.3 }}
      className="space-y-2 px-1 py-2"
    >
      <p className="text-xs text-white/60">{prompt}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option, i) => (
          <motion.button
            key={option.label}
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.25 }}
            onClick={() => onSelect(option.action)}
            className={
              i === 0
                ? 'cursor-pointer rounded-full border border-[#00D4FF]/40 bg-[#00D4FF]/20 px-3 py-1.5 text-xs font-medium text-[#00D4FF] transition-colors hover:bg-[#00D4FF]/30'
                : option.action === 'end'
                  ? 'cursor-pointer rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/40 transition-colors hover:text-white/60'
                  : 'cursor-pointer rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-[#00D4FF]/30 hover:text-white'
            }
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
