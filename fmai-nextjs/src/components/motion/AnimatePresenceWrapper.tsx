'use client'

import type { ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'

interface AnimatePresenceWrapperProps {
  children: ReactNode
  mode?: 'wait' | 'sync' | 'popLayout'
}

/**
 * Client-side AnimatePresence re-export for exit animations.
 *
 * Thin wrapper so Server Components can use exit animations
 * without marking the entire page as "use client".
 */
export function AnimatePresenceWrapper({ children, mode = 'wait' }: AnimatePresenceWrapperProps) {
  return <AnimatePresence mode={mode}>{children}</AnimatePresence>
}

export default AnimatePresenceWrapper
