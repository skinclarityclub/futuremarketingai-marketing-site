/**
 * Glassmorphism Styles
 *
 * Reusable Tailwind classes for glassmorphic design
 * NOTE: App is dark-mode-only, so all styles are optimized for dark backgrounds
 */

/**
 * Base Glass Effect
 * Semi-transparent with backdrop blur (dark mode optimized)
 */
export const glassBase = [
  'backdrop-blur-xl',
  'backdrop-saturate-150',
  'bg-slate-900/30',
  'border border-slate-700/30',
].join(' ')

/**
 * Full Glass Panel
 * For larger components like modals and panels
 */
export const glassPanel = [glassBase, 'shadow-2xl', 'shadow-purple-500/10'].join(' ')

/**
 * Glass Card (Smaller component)
 */
export const glassCard = [glassBase, 'shadow-lg', 'rounded-xl'].join(' ')

/**
 * Glass Button
 */
export const glassButton = [
  'bg-slate-800/30',
  'hover:bg-slate-800/50',
  'active:bg-slate-800/70',
  'backdrop-blur-md',
  'border border-slate-600/30',
  'transition-all duration-200',
].join(' ')

/**
 * Glass Input
 */
export const glassInput = [
  'backdrop-blur-md',
  'bg-slate-900/20',
  'border border-slate-700/30',
  'focus:border-purple-500/50',
  'focus:ring-2 focus:ring-purple-400/20',
  'transition-all duration-200',
].join(' ')

/**
 * Glass Header/Footer
 */
export const glassHeaderFooter = [
  'backdrop-blur-sm',
  'bg-gradient-to-b from-slate-900/20 to-transparent',
  'border-b border-slate-700/20',
].join(' ')
