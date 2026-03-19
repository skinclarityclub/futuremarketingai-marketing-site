'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useInView } from 'motion/react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

const getAnimation = (direction: ScrollRevealProps['direction']) => {
  switch (direction) {
    case 'left':
      return { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }
    case 'right':
      return { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }
    case 'none':
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    case 'up':
    default:
      return { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
  }
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const { hidden, visible } = getAnimation(direction)

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
