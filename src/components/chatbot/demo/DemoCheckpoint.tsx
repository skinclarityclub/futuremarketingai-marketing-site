import { motion } from 'framer-motion'

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
      <p className="text-xs text-text-secondary">{prompt}</p>
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
                ? 'animate-[pulseGlow_2s_ease-in-out_2s_infinite] cursor-pointer rounded-full border border-accent-system/40 bg-accent-system/20 px-3 py-1.5 text-xs font-medium text-accent-system transition-colors hover:bg-accent-system/30'
                : option.action === 'end'
                  ? 'cursor-pointer rounded-full border border-border-primary/50 px-3 py-1.5 text-xs text-text-secondary/60 transition-colors hover:text-text-secondary'
                  : 'cursor-pointer rounded-full border border-border-primary px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent-system/30 hover:text-text-primary'
            }
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
