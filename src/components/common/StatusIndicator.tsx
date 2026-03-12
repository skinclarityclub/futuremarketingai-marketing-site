import React from 'react'

type StatusVariant = 'active' | 'attention' | 'inactive' | 'system'

interface StatusIndicatorProps {
  /** Status type controls color */
  variant?: StatusVariant
  /** Optional label text (rendered in monospace) */
  label?: string
  /** Animate with pulse effect */
  pulse?: boolean
  /** Size: sm = 6px, md = 8px, lg = 10px */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantColors: Record<StatusVariant, string> = {
  active: 'bg-status-active',
  attention: 'bg-accent-human',
  inactive: 'bg-text-muted',
  system: 'bg-accent-system',
}

const sizeClasses: Record<string, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

/**
 * StatusIndicator — Small colored dot with optional pulse and label.
 * Used throughout the Living System design for operational status.
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  variant = 'active',
  label,
  pulse = true,
  size = 'md',
  className = '',
}) => {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex">
        <span
          className={`${sizeClasses[size]} rounded-full ${variantColors[variant]} ${
            pulse ? 'animate-status-pulse' : ''
          }`}
        />
      </span>
      {label && (
        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">{label}</span>
      )}
    </span>
  )
}

export default StatusIndicator
