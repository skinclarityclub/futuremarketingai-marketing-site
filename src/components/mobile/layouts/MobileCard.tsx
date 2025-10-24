/**
 * MobileCard - Touch-friendly card component
 *
 * Mobile-specific card with proper touch targets and spacing.
 * Includes tap feedback and accessibility features.
 *
 * @desktop-first DO NOT use this in desktop components!
 */

import React from 'react'

interface MobileCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: () => void
}

/**
 * Card component optimized for mobile
 * - Touch-friendly minimum height (min-h-touch)
 * - Proper padding with relative units
 * - Optional tap feedback
 * - Accessible keyboard interaction
 */
export function MobileCard({
  children,
  className = '',
  padding = 'md',
  interactive = false,
  onClick,
}: MobileCardProps) {
  // Padding utilities using rem (relative units)
  const paddingClasses = {
    sm: 'p-4', // 1rem
    md: 'p-6', // 1.5rem
    lg: 'p-8', // 2rem
  }

  // Interactive styles for tappable cards
  const interactiveClasses = interactive
    ? `
      cursor-pointer
      active:scale-[0.98]
      transition-transform duration-150
      hover:bg-bg-hover
    `
    : ''

  // Ensure minimum touch target if interactive
  const touchTargetClass = interactive ? 'min-h-touch' : ''

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  const Component = interactive ? 'button' : 'div'

  return (
    <Component
      className={`
        ${paddingClasses[padding]}
        ${touchTargetClass}
        ${interactiveClasses}
        bg-bg-card
        rounded-lg
        border border-border-primary
        ${className}
      `.trim()}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      type={interactive && onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  )
}

MobileCard.displayName = 'MobileCard'
