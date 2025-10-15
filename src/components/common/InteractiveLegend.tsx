/**
 * InteractiveLegend Component
 *
 * Accessible, interactive legend for chart visualizations.
 *
 * Features:
 * - Click to toggle series visibility
 * - Keyboard navigation (Space/Enter to toggle)
 * - Visual feedback for active/inactive states
 * - WCAG AA compliant
 * - Touch-friendly
 *
 * Usage:
 * ```tsx
 * <InteractiveLegend
 *   items={[
 *     { key: 'revenue', label: 'Revenue', color: '#8B5CF6' },
 *     { key: 'cost', label: 'Cost', color: '#F59E0B' }
 *   ]}
 *   visibleKeys={visibleSeries}
 *   onToggle={toggleSeries}
 * />
 * ```
 */

import React from 'react'
import { motion } from 'framer-motion'

export interface LegendItem {
  /** Unique key for the series */
  key: string
  /** Display label */
  label: string
  /** Color for the series */
  color: string
  /** Optional icon */
  icon?: React.ReactNode
}

export interface InteractiveLegendProps {
  /** Legend items to display */
  items: LegendItem[]
  /** Currently visible series keys */
  visibleKeys: Set<string>
  /** Callback when item is toggled */
  onToggle: (key: string) => void
  /** Optional className for container */
  className?: string
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Show reset button */
  showReset?: boolean
  /** Callback for reset all */
  onResetAll?: () => void
}

/**
 * InteractiveLegend Component
 */
export const InteractiveLegend: React.FC<InteractiveLegendProps> = ({
  items,
  visibleKeys,
  onToggle,
  className = '',
  orientation = 'horizontal',
  showReset = false,
  onResetAll,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, key: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onToggle(key)
    }
  }

  return (
    <div
      className={`flex ${orientation === 'horizontal' ? 'flex-wrap justify-center' : 'flex-col'} gap-3 ${className}`}
      role="group"
      aria-label="Chart legend - click items to show/hide data series"
    >
      {items.map((item) => {
        const isVisible = visibleKeys.has(item.key)

        return (
          <motion.button
            key={item.key}
            onClick={() => onToggle(item.key)}
            onKeyDown={(e) => handleKeyDown(e, item.key)}
            className={`
              flex items-center gap-2
              px-3 py-2 sm:px-4 sm:py-2.5
              min-h-[44px]
              rounded-lg
              transition-all duration-200
              ${
                isVisible
                  ? 'bg-white/10 backdrop-blur-sm'
                  : 'bg-white/5 backdrop-blur-sm opacity-50'
              }
              hover:bg-white/15 hover:scale-105
              active:bg-white/20
              focus:outline-none focus:ring-2 focus:ring-white/30
              cursor-pointer
              touch-manipulation
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={isVisible}
            aria-label={`${item.label}: ${isVisible ? 'visible' : 'hidden'}. Click to ${isVisible ? 'hide' : 'show'}.`}
            role="switch"
          >
            {/* Color indicator */}
            <motion.div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                backgroundColor: isVisible ? item.color : 'transparent',
                border: `2px solid ${item.color}`,
              }}
              animate={{
                opacity: isVisible ? 1 : 0.5,
                scale: isVisible ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Icon (optional) */}
            {item.icon && <span className="flex-shrink-0 text-white/70">{item.icon}</span>}

            {/* Label */}
            <span
              className={`text-sm font-medium transition-colors ${
                isVisible ? 'text-white' : 'text-white/50'
              }`}
            >
              {item.label}
            </span>
          </motion.button>
        )
      })}

      {/* Reset Button */}
      {showReset && onResetAll && (
        <motion.button
          onClick={onResetAll}
          className={`
            flex items-center gap-2
            px-3 py-2 sm:px-4 sm:py-2.5
            min-h-[44px]
            rounded-lg
            bg-white/5 backdrop-blur-sm
            hover:bg-white/10
            active:bg-white/15
            focus:outline-none focus:ring-2 focus:ring-white/30
            cursor-pointer
            touch-manipulation
            border border-white/20
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Show all data series"
        >
          <svg
            className="w-4 h-4 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-sm font-medium text-white/70">Reset</span>
        </motion.button>
      )}
    </div>
  )
}

export default InteractiveLegend
