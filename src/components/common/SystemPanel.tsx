import React from 'react'

interface SystemPanelProps {
  children: React.ReactNode
  className?: string
  /** Optional scan-line overlay effect */
  scanLines?: boolean
  /** Show left accent border on hover */
  hoverAccent?: boolean
  /** Make panel interactive (clickable) */
  onClick?: () => void
  id?: string
}

/**
 * SystemPanel — Primary container component for the Living System design.
 * Replaces GlassCard with solid bg-surface + thin border aesthetic.
 */
export const SystemPanel = React.forwardRef<HTMLDivElement, SystemPanelProps>(
  ({ children, className = '', scanLines = false, hoverAccent = false, onClick, id }, ref) => {
    const baseClasses = [
      'bg-bg-surface border border-border-primary rounded-sm',
      'transition-all duration-200',
      scanLines ? 'scan-lines' : '',
      hoverAccent ? 'hover:border-l-2 hover:border-l-accent-system hover:bg-bg-elevated' : '',
      onClick ? 'cursor-pointer' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        id={id}
        className={baseClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
      >
        {children}
      </div>
    )
  }
)

SystemPanel.displayName = 'SystemPanel'
export default SystemPanel
