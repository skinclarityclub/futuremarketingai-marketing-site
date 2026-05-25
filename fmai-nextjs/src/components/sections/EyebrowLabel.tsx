import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface EyebrowLabelProps {
  children: ReactNode
  className?: string
  as?: 'p' | 'span' | 'div'
}

/**
 * Eyebrow label — mono-uppercase accent text used above section headings.
 * Site-wide primitive (Fase 0). Use above SectionHeading to anchor a section
 * visually and provide a scannable index of page structure.
 */
export function EyebrowLabel({ children, className, as: Tag = 'p' }: EyebrowLabelProps) {
  return (
    <Tag
      className={twMerge(
        'font-mono uppercase tracking-[0.18em] text-xs text-accent-system',
        className
      )}
    >
      {children}
    </Tag>
  )
}
