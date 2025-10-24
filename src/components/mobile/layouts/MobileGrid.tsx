/**
 * MobileGrid - Fluid CSS Grid layout for mobile
 *
 * Mobile-specific grid component with responsive columns and touch-friendly gaps.
 * Uses relative units and adapts to different screen sizes.
 *
 * @desktop-first DO NOT use this in desktop components!
 */

import React from 'react'

interface MobileGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 'auto-fit' | 'auto-fill'
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  minItemWidth?: string
}

/**
 * Responsive CSS Grid for mobile layouts
 * - Fluid columns using CSS Grid
 * - Touch-friendly gaps
 * - Auto-fit/auto-fill for dynamic layouts
 */
export function MobileGrid({
  children,
  className = '',
  columns = 1,
  gap = 'md',
  minItemWidth = '10rem',
}: MobileGridProps) {
  // Gap utilities using rem (relative units)
  const gapClasses = {
    sm: 'gap-3', // 0.75rem (12px)
    md: 'gap-4', // 1rem (16px)
    lg: 'gap-6', // 1.5rem (24px)
    xl: 'gap-8', // 2rem (32px)
  }

  // Column configurations
  const getGridStyle = () => {
    if (columns === 'auto-fit') {
      return {
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
      }
    }
    if (columns === 'auto-fill') {
      return {
        gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`,
      }
    }
    return {}
  }

  const gridColsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    'auto-fit': '',
    'auto-fill': '',
  }

  return (
    <div
      className={`
        grid
        ${typeof columns === 'number' ? gridColsClasses[columns] : ''}
        ${gapClasses[gap]}
        ${className}
      `.trim()}
      style={getGridStyle()}
    >
      {children}
    </div>
  )
}

MobileGrid.displayName = 'MobileGrid'
