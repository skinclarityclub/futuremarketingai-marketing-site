import type { ReactNode, ElementType } from 'react'
import { twMerge } from 'tailwind-merge'

interface GlassCardProps {
  children: ReactNode
  as?: ElementType
  className?: string
  highlighted?: boolean
}

export function GlassCard({
  children,
  as: Component = 'div',
  className,
  highlighted = false,
}: GlassCardProps) {
  return (
    <Component
      className={twMerge(
        'bg-white/[0.02] backdrop-blur-sm rounded-[var(--radius-card)] p-8 transition-all duration-500',
        highlighted
          ? 'border border-accent-system/50 shadow-glow-sm'
          : 'border border-border-primary',
        'hover:bg-white/[0.04]',
        className
      )}
    >
      {children}
    </Component>
  )
}
