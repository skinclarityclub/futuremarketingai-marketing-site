import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface SectionHeadingProps {
  children: ReactNode
  id: string
  className?: string
}

export function SectionHeading({ children, id, className }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className={twMerge(
        'text-3xl md:text-4xl font-bold font-display text-text-primary',
        className
      )}
    >
      {children}
    </h2>
  )
}
