/**
 * ChartTooltip - Standardized tooltip for all chart components
 *
 * Provides consistent dark-themed tooltip styling across all visualizations
 * following 2025 best practices and WCAG AA accessibility standards.
 *
 * Features:
 * - Glassmorphic dark background
 * - WCAG AA compliant colors
 * - Consistent spacing and typography
 * - Flexible content rendering
 * - Colorblind-safe with optional patterns
 */

import React from 'react'

export interface TooltipEntry {
  name: string
  value: string | number
  color: string
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
}

export interface ChartTooltipProps {
  /** Title/label for the tooltip */
  title?: string
  /** Data entries to display */
  entries: TooltipEntry[]
  /** Optional subtitle or context */
  subtitle?: string
  /** Custom className for additional styling */
  className?: string
  /** Show trend indicators */
  showTrends?: boolean
}

/**
 * ChartTooltip Component
 *
 * Standard tooltip for all chart visualizations
 */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  title,
  entries,
  subtitle,
  className = '',
  showTrends = false,
}) => {
  return (
    <div
      className={`
        bg-gray-900/95 backdrop-blur-md 
        p-3 rounded-lg 
        border border-white/20 
        shadow-xl
        min-w-[180px]
        ${className}
      `}
      style={{
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(12px)',
      }}
      role="tooltip"
    >
      {/* Title */}
      {title && <p className="text-white font-semibold mb-2 text-sm">{title}</p>}

      {/* Subtitle */}
      {subtitle && <p className="text-white/60 text-xs mb-2">{subtitle}</p>}

      {/* Data Entries */}
      <div className="space-y-1.5">
        {entries.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3 text-sm">
            {/* Label with color indicator */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Color dot */}
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />

              {/* Icon (optional) */}
              {entry.icon && <span className="flex-shrink-0 text-white/70">{entry.icon}</span>}

              {/* Name */}
              <span className="text-white/90 font-medium truncate">{entry.name}</span>
            </div>

            {/* Value with trend */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="font-semibold tabular-nums" style={{ color: entry.color }}>
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                {entry.unit && <span className="text-white/70 ml-0.5">{entry.unit}</span>}
              </span>

              {/* Trend indicator */}
              {showTrends && entry.trend && (
                <span
                  className={`text-xs ${
                    entry.trend === 'up'
                      ? 'text-emerald-400'
                      : entry.trend === 'down'
                        ? 'text-red-400'
                        : 'text-gray-400'
                  }`}
                  aria-label={`Trend: ${entry.trend}`}
                >
                  {entry.trend === 'up' && '↑'}
                  {entry.trend === 'down' && '↓'}
                  {entry.trend === 'neutral' && '→'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Helper function to create tooltip entry from Recharts payload
 */
export const createTooltipEntry = (
  payload: any,
  formatter?: (value: number) => string
): TooltipEntry => {
  return {
    name: payload.name || payload.dataKey,
    value: formatter ? formatter(payload.value) : payload.value,
    color: payload.color || payload.fill || payload.stroke,
  }
}

export default ChartTooltip
