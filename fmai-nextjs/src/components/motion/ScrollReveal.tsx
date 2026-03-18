'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

const getInitial = (direction: ScrollRevealProps['direction']) => {
  switch (direction) {
    case 'left':
      return { opacity: 0, x: -30 }
    case 'right':
      return { opacity: 0, x: 30 }
    case 'none':
      return { opacity: 0 }
    case 'up':
    default:
      return { opacity: 0, y: 30 }
  }
}

/**
 * ScrollReveal -- Scroll-triggered animation wrapper.
 *
 * Wraps children in a motion.div that fades/slides into view
 * when scrolled into the viewport. Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const initial = getInitial(direction)
  const animate = { opacity: 1, y: 0, x: 0 }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
