import React from 'react'

interface SectionContainerProps {
  children: React.ReactNode
  /** Section ID for anchor links */
  id?: string
  /** Max width: 'md' (768px), 'lg' (1024px), 'xl' (1280px), '2xl' (1400px) */
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl'
  /** Vertical padding size */
  padding?: 'sm' | 'md' | 'lg'
  className?: string
}

const maxWidthClasses = {
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
}

const paddingClasses = {
  sm: 'py-12 px-6',
  md: 'py-16 px-6',
  lg: 'py-24 px-6',
}

/**
 * SectionContainer — Consistent section wrapper for all page sections.
 * Centers content, applies consistent padding and max-width.
 */
export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  id,
  maxWidth = 'xl',
  padding = 'md',
  className = '',
}) => {
  return (
    <section id={id} className={`${paddingClasses[padding]} ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>{children}</div>
    </section>
  )
}

export default SectionContainer
