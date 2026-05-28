'use client'

import { AnimatePresence, motion } from 'motion/react'
import { X, ArrowRight } from 'lucide-react'

interface ProactiveNudgeProps {
  message: string
  visible: boolean
  onAccept: () => void
  onDismiss: () => void
}

export function ProactiveNudge({ message, visible, onAccept, onDismiss }: ProactiveNudgeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="fixed bottom-[88px] right-6 lg:bottom-[96px] z-[62] flex max-w-[260px] items-start gap-2 rounded-2xl border border-accent-system/25 bg-bg-surface/96 px-4 py-3 backdrop-blur-xl"
          style={{
            boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,170,0.06)',
          }}
        >
          {/* caret pointing down to FAB */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[7px] right-5 h-3 w-3 rotate-45 border-b border-r border-accent-system/20 bg-bg-surface/96"
          />
          <button
            type="button"
            onClick={onAccept}
            className="group flex flex-1 items-start gap-2 text-left"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-system/15">
              <ArrowRight className="h-3 w-3 text-accent-system transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
            <span className="text-sm font-medium leading-snug text-text-primary transition-colors group-hover:text-accent-system">
              {message}
            </span>
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Sluit melding"
            className="mt-0.5 shrink-0 rounded p-0.5 text-text-faint transition-colors hover:text-text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProactiveNudge
