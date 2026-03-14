import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ToolResultRenderer } from './tool-results'

interface SidePanelProps {
  isOpen: boolean
  content: { toolName: string; data: unknown } | null
  onClose: () => void
}

export function SidePanel({ isOpen, content, onClose }: SidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && content && (
        <>
          {/* Mobile: full-screen modal overlay (below lg breakpoint) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex flex-col bg-bg-surface overflow-y-auto lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-border-primary px-4 py-3">
              <span className="font-sans text-sm font-medium text-text-primary">Details</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details panel"
                className="rounded p-1.5 text-text-secondary transition-colors hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <ToolResultRenderer
                part={{
                  type: 'tool-invocation',
                  toolName: content.toolName,
                  state: 'output-available',
                  output: content.data,
                  toolInvocationId: 'side-panel',
                }}
              />
            </div>
          </motion.div>

          {/* Desktop: inline side panel (lg and above) */}
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 420 }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="hidden lg:flex h-full flex-col border-l border-border-primary bg-bg-surface/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border-primary px-4 py-3 shrink-0">
              <span className="font-sans text-sm font-medium text-text-primary">Details</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details panel"
                className="rounded p-1.5 text-text-secondary transition-colors hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ToolResultRenderer
                part={{
                  type: 'tool-invocation',
                  toolName: content.toolName,
                  state: 'output-available',
                  output: content.data,
                  toolInvocationId: 'side-panel',
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SidePanel
