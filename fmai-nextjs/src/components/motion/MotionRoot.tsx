'use client'

import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'

/**
 * Wraps children in MotionConfig with reducedMotion="user" so all motion-react
 * animations across the site automatically strip transform / scale / filter
 * when the user has prefers-reduced-motion: reduce — without each call site
 * needing its own useReducedMotion guard. Opacity-only fades still play.
 *
 * Lives as a client wrapper because MotionConfig is a client-side context.
 * Imported in src/app/[locale]/layout.tsx around the locale tree.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
