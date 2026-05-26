'use client'

import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import {
  EASE_OUT,
  DEFAULT_DURATION,
  STAGGER_NORMAL,
  VIEWPORT_DEFAULT,
} from '@/lib/motion/easings'

interface RevealContainerProps {
  children: ReactNode
  className?: string
  /** Stagger delay between children (default STAGGER_NORMAL). */
  stagger?: number
  /** Skip the in-view trigger (animate on mount). */
  immediate?: boolean
  as?: 'div' | 'section' | 'ul' | 'ol'
}

interface RevealItemProps {
  children: ReactNode
  className?: string
  /** Translate-Y distance in px. 0 = opacity-only (cheaper). */
  yOffset?: number
  /** Per-item duration override. */
  duration?: number
  as?: 'div' | 'li' | 'article'
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_NORMAL,
    },
  },
}

/**
 * RevealContainer — site-wide whileInView stagger wrapper.
 * Wrap a grid / list / column of RevealItem children to get a coordinated
 * cascade reveal on first scroll into view. Reduced-motion is handled
 * globally via MotionConfig in MotionRoot (transforms stripped, opacity
 * still fades). Site-wide primitive (Fase 0).
 */
export function RevealContainer({
  children,
  className,
  stagger,
  immediate = false,
  as = 'div',
}: RevealContainerProps) {
  const variants: Variants =
    stagger !== undefined
      ? {
          hidden: {},
          visible: { transition: { staggerChildren: stagger } },
        }
      : containerVariants

  const MotionTag = motion[as]

  if (immediate) {
    return (
      <MotionTag
        className={className}
        variants={variants}
        initial="hidden"
        animate="visible"
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_DEFAULT}
    >
      {children}
    </MotionTag>
  )
}

/**
 * RevealItem — child of RevealContainer. Renders inert (no inView listener)
 * so the parent orchestrates timing. Reduced-motion strips the y transform.
 */
export function RevealItem({
  children,
  className,
  yOffset = 16,
  duration = DEFAULT_DURATION,
  as = 'div',
}: RevealItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: EASE_OUT },
    },
  }

  const MotionTag = motion[as]

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  )
}
