import React from 'react'

interface MetricDisplayProps {
  /** The number/value to display (large, monospace) */
  value: string
  /** Small label below the value */
  label: string
  /** Color accent for the value */
  accent?: 'system' | 'human' | 'active'
  /** Optional prefix (e.g., "<" or "+") */
  prefix?: string
  /** Optional suffix (e.g., "%" or "hrs") */
  suffix?: string
  className?: string
}

const accentColors: Record<string, string> = {
  system: 'text-accent-system',
  human: 'text-accent-human',
  active: 'text-status-active',
}

/**
 * MetricDisplay — Large monospace number with small label.
 * Used for hero metrics, dashboard stats, and data displays.
 */
export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  value,
  label,
  accent = 'system',
  prefix = '',
  suffix = '',
  className = '',
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className={`font-mono text-3xl md:text-4xl font-bold ${accentColors[accent]}`}>
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="font-mono text-xs uppercase tracking-wider text-text-muted mt-2">{label}</div>
    </div>
  )
}

export default MetricDisplay
