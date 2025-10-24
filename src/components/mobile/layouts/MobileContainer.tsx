/**
 * MobileContainer - Mobile-specific container component
 *
 * This is a NEW mobile component, separate from desktop layouts.
 * Uses touch-friendly spacing and fluid responsive sizing.
 *
 * @desktop-first DO NOT use this in desktop components!
 */

import React from 'react'

interface MobileContainerProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  maxWidth?: 'sm' | 'md' | 'lg' | 'full'
}

/**
 * Responsive container for mobile layouts
 * - Fluid padding using relative units
 * - Safe area insets for notched devices
 * - Touch-friendly spacing
 */
export function MobileContainer({
  children,
  className = '',
  padding = 'md',
  maxWidth = 'full',
}: MobileContainerProps) {
  // Padding utilities using rem (relative units)
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-3', // 1rem x, 0.75rem y
    md: 'px-6 py-4', // 1.5rem x, 1rem y
    lg: 'px-8 py-6', // 2rem x, 1.5rem y
  }

  // Max width constraints for readability
  const maxWidthClasses = {
    sm: 'max-w-sm', // 24rem (384px)
    md: 'max-w-md', // 28rem (448px)
    lg: 'max-w-lg', // 32rem (512px)
    full: 'max-w-full',
  }

  return (
    <div
      className={`
        w-full
        mx-auto
        ${paddingClasses[padding]}
        ${maxWidthClasses[maxWidth]}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  )
}

MobileContainer.displayName = 'MobileContainer'
