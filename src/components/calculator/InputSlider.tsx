import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export interface InputSliderProps {
  /** Label for the slider */
  label: string
  /** Current value */
  value: number
  /** Minimum allowed value */
  min: number
  /** Maximum allowed value */
  max: number
  /** Step increment */
  step?: number
  /** Unit to display (e.g., 'people', '$', '%') */
  unit?: string
  /** Whether to format as currency */
  isCurrency?: boolean
  /** Change handler */
  onChange: (value: number) => void
  /** Optional description/help text */
  description?: string
  /** Custom formatter function (alias for formatter) */
  formatValue?: (value: number) => string
  /** Custom formatter function */
  formatter?: (value: number) => string
  /** Optional error message */
  error?: string
}

/**
 * InputSlider - A reusable slider component with validation and display
 *
 * Features:
 * - Range validation
 * - Current value display
 * - Clear labels and descriptions
 * - Custom formatting options
 * - Error handling
 */
export const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  isCurrency = false,
  onChange,
  description,
  formatValue: formatValueProp,
  formatter,
  error,
}) => {
  const { t } = useTranslation(['calculator'])
  const [inputValue, setInputValue] = useState(value.toString())
  const [isValid, setIsValid] = useState(true)

  // Generate unique ID for ARIA relationships
  const inputId = React.useId()
  const errorId = `${inputId}-error`
  const hasError = error || !isValid

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  // Format display value
  const formatValue = (val: number): string => {
    if (formatValueProp) {
      return formatValueProp(val)
    }
    if (formatter) {
      return formatter(val)
    }
    if (isCurrency) {
      return `$${val.toLocaleString()}`
    }
    return `${val.toLocaleString()}${unit ? ` ${unit}` : ''}`
  }

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    onChange(newValue)
    setInputValue(newValue.toString())
    setIsValid(true)
  }

  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    setInputValue(rawValue)

    // Validate input
    const numValue = Number(rawValue)
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setIsValid(false)
      return
    }

    setIsValid(true)
    onChange(numValue)
  }

  // Handle input blur - reset to valid value if invalid
  const handleInputBlur = () => {
    if (!isValid) {
      setInputValue(value.toString())
      setIsValid(true)
    }
  }

  return (
    <div className="space-y-3">
      {/* Label and Value Display */}
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-text-primary font-semibold">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? errorId : undefined}
            aria-label={`${label} direct input`}
            className={`
              w-24 px-3 py-1 text-right
              bg-bg-surface/50 backdrop-blur-sm
              border rounded-lg
              text-text-primary font-semibold
              focus:outline-none focus:ring-2 focus:ring-accent-primary/50
              transition-all duration-200
              ${hasError ? 'border-accent-warning/50' : 'border-border-primary/30'}
            `}
          />
          <span className="text-white/90 text-sm min-w-[80px]" aria-live="polite">
            {formatValue(value)}
          </span>
        </div>
      </div>

      {/* Description */}
      {description && <p className="text-sm text-white/80">{description}</p>}

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          aria-label={`${label} slider`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : undefined}
          className="
            w-full h-3 rounded-lg appearance-none cursor-pointer
            bg-bg-surface/30 backdrop-blur-sm
            accent-accent-primary
            transition-all duration-200
            hover:bg-bg-surface/50
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-11
            [&::-webkit-slider-thumb]:h-11
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-accent-primary
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-glow-primary
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white/20
            [&::-moz-range-thumb]:w-11
            [&::-moz-range-thumb]:h-11
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-accent-primary
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white/20
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:shadow-glow-primary
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:duration-200
            [&::-moz-range-thumb]:hover:scale-110
          "
        />

        {/* Range Labels */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/70">{formatValue(min)}</span>
          <span className="text-xs text-white/70">{formatValue(max)}</span>
        </div>
      </div>

      {/* Error Message - WCAG 3.3.1, 4.1.3 compliant */}
      {hasError && (
        <div
          id={errorId}
          role="alert"
          aria-live="assertive"
          className="text-sm text-accent-warning"
        >
          {error || t('calculator:inputs.validation_error', { min, max })}
        </div>
      )}
    </div>
  )
}

export default InputSlider
