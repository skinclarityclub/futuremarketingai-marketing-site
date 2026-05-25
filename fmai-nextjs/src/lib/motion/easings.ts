/**
 * Motion design tokens. Centralized so easings + durations + viewport defaults
 * are consistent across the site. Plan v2.1 W4 D2.
 *
 * Reduced-motion is handled globally via <MotionConfig reducedMotion="user">
 * in MotionRoot, so individual components don't need to import a hook for
 * the common case — transforms/scales/filters are stripped automatically.
 */

/** Apple-like ease-out, used for entrance animations. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** Symmetric ease for state transitions. */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

/** Default duration for one-shot reveals. */
export const DEFAULT_DURATION = 0.4

/** Stagger between siblings — fast tier (counter rolls, dense grids). */
export const STAGGER_FAST = 0.05

/** Stagger between siblings — normal tier (card grids, sections). */
export const STAGGER_NORMAL = 0.07

/** Default viewport options for whileInView reveals. */
export const VIEWPORT_DEFAULT = { once: true, margin: '-80px' } as const
