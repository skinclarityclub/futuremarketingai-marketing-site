'use client'

import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, X } from 'lucide-react'
import { ToolResultRenderer } from './tool-results'

interface SidePanelProps {
  isOpen: boolean
  content: { toolName: string; data: unknown } | null
  onClose: () => void
}

function SidePanelToolCard({ content }: { content: { toolName: string; data: unknown } }) {
  return (
    <ToolResultRenderer
      part={{
        type: 'tool-invocation',
        toolName: content.toolName,
        state: 'output-available',
        output: content.data,
        toolInvocationId: 'side-panel',
      }}
    />
  )
}

export function SidePanel({ isOpen, content, onClose }: SidePanelProps) {
  return (
    <>
      {/* Mobile: portal to body to escape backdrop-filter containing block */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && content && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
                  onClick={onClose}
                />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed inset-0 z-[60] flex flex-col bg-bg-surface overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between border-b border-border-primary px-4 py-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="Back to chat"
                        className="rounded p-1 text-text-secondary transition-colors hover:text-text-primary"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <span className="font-sans text-sm font-medium text-text-primary">
                        Details
                      </span>
                    </div>
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
                    <SidePanelToolCard content={content} />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Desktop: inline side panel on LEFT of chat (lg and above) */}
      <AnimatePresence>
        {isOpen && content && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'min(520px, 40vw)' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden lg:flex h-full shrink-0 flex-col border-r border-border-primary bg-bg-surface/95 backdrop-blur-xl overflow-hidden min-w-[280px]"
          >
            <div className="flex items-center justify-between border-b border-border-primary px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close details panel"
                  className="rounded p-1 text-text-secondary transition-colors hover:text-text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="font-sans text-sm font-medium text-text-primary">Details</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SidePanelToolCard content={content} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SidePanel
