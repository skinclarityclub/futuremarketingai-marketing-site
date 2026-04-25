'use client'

import { motion } from 'motion/react'
import { PartyPopper, ArrowRight, RotateCcw } from 'lucide-react'

interface DemoCompletionCardProps {
  scenarioTitle: string
  durationSeconds: number
  onTryAnother: () => void
  onBookCall: () => void
  onEndDemo: () => void
}

export function DemoCompletionCard({
  scenarioTitle,
  durationSeconds,
  onTryAnother,
  onBookCall,
  onEndDemo,
}: DemoCompletionCardProps) {
  const durationMin = Math.ceil(durationSeconds / 60)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="mx-1 rounded-xl border border-accent-system/20 bg-gradient-to-br from-accent-system/10 to-accent-human/5 p-4 backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-system/20">
          <PartyPopper className="h-4 w-4 text-accent-system" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Demo Complete</p>
          <p className="mt-0.5 text-xs text-white/60">
            {scenarioTitle} -- {durationMin} min
          </p>
          <p className="mt-2 text-[11px] text-accent-system/70">
            86% of prospects book a call after this demo
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onBookCall}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-accent-system/40 bg-accent-system/20 px-3 py-1.5 text-xs font-medium text-accent-system transition-colors hover:bg-accent-system/30"
        >
          Book a call <ArrowRight className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onTryAnother}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:text-white"
        >
          <RotateCcw className="h-3 w-3" /> Try another
        </button>
        <button
          type="button"
          onClick={onEndDemo}
          className="cursor-pointer rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/40 transition-colors hover:text-white/60"
        >
          End demo
        </button>
      </div>
    </motion.div>
  )
}
