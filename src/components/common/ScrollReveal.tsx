import React from 'react'
import { motion } from 'framer-motion'
import { useMotionSafe } from '../../hooks/useReducedMotion'

/**
 * ScrollReveal — Reusable scroll-triggered reveal animation wrapper.
 *
 * Wraps children in a Framer Motion div that fades/slides into view
 * when scrolled into the viewport. Respects prefers-reduced-motion
 * via useMotionSafe (returns no animation props when reduced motion
 * is preferred).
 */

interface ScrollRevealProps {
  children: React.ReactNode
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

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className,
}) => {
  const initial = getInitial(direction)
  const animate = { opacity: 1, y: 0, x: 0 }

  const props = useMotionSafe({
    initial,
    whileInView: animate,
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  })

  return (
    <motion.div {...props} className={className}>
      {children}
    </motion.div>
  )
}

export default ScrollReveal
