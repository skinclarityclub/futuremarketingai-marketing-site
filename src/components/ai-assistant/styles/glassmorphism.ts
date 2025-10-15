/**
 * Glassmorphism Styles
 *
 * Reusable Tailwind classes for glassmorphic design
 */

/**
 * Base Glass Effect
 * Semi-transparent with backdrop blur
 */
export const glassBase = [
  'backdrop-blur-xl',
  'backdrop-saturate-150',
  'border border-white/20',
].join(' ')

/**
 * Dark Mode Glass Effect
 */
export const glassDark = ['dark:bg-slate-900/30', 'dark:border-slate-700/30'].join(' ')

/**
 * Full Glass Panel (Light + Dark)
 */
export const glassPanel = [glassBase, glassDark, 'shadow-2xl', 'shadow-purple-500/10'].join(' ')

/**
 * Glass Card (Smaller component)
 */
export const glassCard = [glassBase, glassDark, 'shadow-lg', 'rounded-xl'].join(' ')

/**
 * Glass Button
 */
export const glassButton = [
  'bg-white/20',
  'hover:bg-white/30',
  'active:bg-white/40',
  'backdrop-blur-md',
  'border border-white/30',
  'dark:bg-slate-800/30',
  'dark:hover:bg-slate-800/50',
  'dark:border-slate-600/30',
  'transition-all duration-200',
].join(' ')

/**
 * Glass Input
 */
export const glassInput = [
  'backdrop-blur-md',
  'border border-white/20',
  'focus:border-purple-400/50',
  'focus:ring-2 focus:ring-purple-400/20',
  'dark:bg-slate-900/20',
  'dark:border-slate-700/30',
  'dark:focus:border-purple-500/50',
  'transition-all duration-200',
].join(' ')

/**
 * Glass Header/Footer
 */
export const glassHeaderFooter = [
  'backdrop-blur-sm',
  'border-b border-white/10',
  'dark:from-slate-900/20',
  'dark:border-slate-700/20',
].join(' ')
