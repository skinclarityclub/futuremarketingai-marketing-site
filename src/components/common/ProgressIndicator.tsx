import React from 'react'
import { useTranslation } from 'react-i18next'

interface ProgressIndicatorProps {
  value?: number // 0-100 for determinate mode
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success'
  showLabel?: boolean
  label?: string
  indeterminate?: boolean
  className?: string
}

/**
 * ProgressIndicator - Progress bar component with determinate and indeterminate modes
 *
 * @param value - Progress value 0-100 (determinate mode)
 * @param size - Size: 'sm' | 'md' | 'lg'
 * @param color - Color theme: 'primary' | 'secondary' | 'success'
 * @param showLabel - Show percentage label
 * @param label - Custom label text
 * @param indeterminate - Enable indeterminate mode (animated)
 */
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value = 0,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  indeterminate = false,
  className = '',
}) => {
  const { t } = useTranslation(['common'])
  const clampedValue = Math.min(Math.max(value, 0), 100)

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const colorClasses = {
    primary: 'bg-accent-primary shadow-glow',
    secondary: 'bg-accent-secondary shadow-glow-purple',
    success: 'bg-success shadow-glow-green',
  }

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/90">{label || t('common:progress.label')}</span>
          {!indeterminate && showLabel && (
            <span className="text-sm font-medium text-text-primary">{clampedValue}%</span>
          )}
        </div>
      )}

      <div
        className={`
          w-full ${sizeClasses[size]} bg-bg-surface rounded-full overflow-hidden
          border border-border-primary
        `}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : 100}
        aria-label={label || t('common:progress.label')}
      >
        {indeterminate ? (
          /* Indeterminate Mode - Animated */
          <div
            className={`
              h-full ${colorClasses[color]} rounded-full
              animate-pulse
            `}
            style={{
              width: '100%',
              animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
        ) : (
          /* Determinate Mode - Value-based */
          <div
            className={`
              h-full ${colorClasses[color]} rounded-full
              transition-all duration-300 ease-out
            `}
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>
    </div>
  )
}

export default ProgressIndicator
