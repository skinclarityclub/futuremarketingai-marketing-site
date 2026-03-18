'use client'

import { motion } from 'motion/react'

/**
 * Client-side motion element re-exports.
 *
 * Thin wrappers that allow Server Component pages to use
 * motion elements without marking the entire page as "use client".
 */
export const MotionDiv = motion.div
export const MotionSpan = motion.span
export const MotionSection = motion.section
