/**
 * Reduced Motion Utilities
 *
 * Helper functions for implementing reduced motion animations.
 * Use with `usePrefersReducedMotion` hook from useMediaQuery.
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
 */

/**
 * getReducedMotionConfig - Helper to get reduced motion variants/config
 *
 * Returns either the reduced or full animation config based on user preference.
 *
 * @param fullConfig - Full animation configuration
 * @param reducedConfig - Simplified/instant animation configuration
 * @param prefersReducedMotion - User's motion preference
 *
 * @example
 * ```tsx
 * const config = getReducedMotionConfig(
 *   { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Full
 *   { opacity: 1, y: 0, transition: { duration: 0 } },   // Reduced
 *   prefersReducedMotion
 * );
 * ```
 */
export function getReducedMotionConfig<T>(
  fullConfig: T,
  reducedConfig: T,
  prefersReducedMotion: boolean
): T {
  return prefersReducedMotion ? reducedConfig : fullConfig
}

/**
 * getReducedMotionTransition - Helper to create motion-aware transitions
 *
 * @param duration - Full animation duration in seconds
 * @param prefersReducedMotion - User's motion preference
 *
 * @example
 * ```tsx
 * transition={getReducedMotionTransition(0.5, prefersReducedMotion)}
 * // Returns: { duration: 0.5 } or { duration: 0 }
 * ```
 */
export function getReducedMotionTransition(
  duration: number,
  prefersReducedMotion: boolean
): { duration: number; delay?: number } {
  return prefersReducedMotion ? { duration: 0, delay: 0 } : { duration }
}
