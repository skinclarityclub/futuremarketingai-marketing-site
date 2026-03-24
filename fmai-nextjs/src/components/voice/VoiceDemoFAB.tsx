'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Phone } from 'lucide-react'

interface VoiceDemoFABProps {
  /** ID of the section to observe and scroll to */
  targetId?: string
}

export function VoiceDemoFAB({ targetId = 'live-demo' }: VoiceDemoFABProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show FAB when the demo section is NOT in the viewport
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  const scrollToDemo = () => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={scrollToDemo}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent-system flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-shadow duration-300"
          aria-label="Scroll to voice demo"
        >
          <Phone className="w-5 h-5 text-bg-deep" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
