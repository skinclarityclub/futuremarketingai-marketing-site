'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'

interface DemoProgressProps {
  totalSteps: number
  currentStep: number
}

export function DemoProgress({ totalSteps, currentStep }: DemoProgressProps) {
  return (
    <div className="flex items-center gap-1.5 px-1">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = i < currentStep
        const isCurrent = i === currentStep

        return (
          <motion.div
            key={i}
            className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-300 ${
              isCompleted
                ? 'bg-gradient-to-br from-accent-system to-accent-human'
                : isCurrent
                  ? 'border-2 border-accent-system bg-accent-system/10'
                  : 'border border-white/10 bg-bg-surface/50'
            }`}
          >
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              </motion.div>
            )}
            {isCurrent && (
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-accent-system"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
