/**
 * MobileStack - Flexbox stack layout for mobile
 *
 * Mobile-specific stack component for vertical/horizontal layouts.
 * Uses flexbox with touch-friendly spacing and fluid sizing.
 *
 * @desktop-first DO NOT use this in desktop components!
 */

import React from 'react'

interface MobileStackProps {
  children: React.ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

/**
 * Flexbox stack for mobile layouts
 * - Vertical or horizontal direction
 * - Touch-friendly spacing
 * - Flexible alignment options
 */
export function MobileStack({
  children,
  className = '',
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
}: MobileStackProps) {
  // Gap utilities using rem (relative units)
  const gapClasses = {
    sm: 'gap-3', // 0.75rem (12px)
    md: 'gap-4', // 1rem (16px)
    lg: 'gap-6', // 1.5rem (24px)
    xl: 'gap-8', // 2rem (32px)
  }

  // Direction
  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  }

  // Alignment
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  // Justification
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }

  return (
    <div
      className={`
        flex
        ${directionClasses[direction]}
        ${gapClasses[gap]}
        ${alignClasses[align]}
        ${justifyClasses[justify]}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  )
}

MobileStack.displayName = 'MobileStack'
