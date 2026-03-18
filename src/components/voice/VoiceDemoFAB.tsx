import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, X } from 'lucide-react'
import { useElevenLabsCall } from '../../hooks/useElevenLabsCall'
import { VoiceDemoPhone } from './VoiceDemoPhone'
import { cn } from '../../lib/utils'

interface VoiceDemoFABProps {
  visible: boolean
}

export function VoiceDemoFAB({ visible }: VoiceDemoFABProps) {
  const [expanded, setExpanded] = useState(false)
  const call = useElevenLabsCall()
  const isInCall = call.state === 'active' || call.state === 'connecting'

  return (
    <AnimatePresence>
      {visible && (
        <>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-24 right-6 z-50 bg-bg-surface/95 backdrop-blur-xl border border-border-primary rounded-card shadow-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(false)}
                  className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Close voice demo"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>

                <VoiceDemoPhone call={call} compact />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300',
              expanded
                ? 'bg-white/10 border border-border-primary'
                : isInCall
                  ? 'bg-accent-system shadow-glow animate-glow-pulse'
                  : 'bg-accent-system shadow-glow-sm hover:shadow-glow cta-pulse'
            )}
            aria-label={expanded ? 'Close voice demo' : 'Open voice demo'}
          >
            {expanded ? (
              <X className="w-5 h-5 text-text-primary" />
            ) : (
              <Mic className="w-5 h-5 text-bg-deep" />
            )}
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
