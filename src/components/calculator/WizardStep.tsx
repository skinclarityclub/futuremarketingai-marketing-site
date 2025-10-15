import React, { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDebounce } from '../../hooks'

/**
 * WizardStep - Individual step wrapper with transitions
 *
 * Features:
 * - Encapsulates step content
 * - Smooth entry/exit animations
 * - Auto-advance on completion
 * - Debounced input changes
 * - Keyboard navigation support
 */

export interface WizardStepProps {
  stepNumber: number
  title: string
  subtitle?: string
  icon?: string
  isActive: boolean
  isComplete: boolean
  autoAdvance?: boolean
  autoAdvanceDelay?: number // ms after completion
  onNext?: () => void
  onPrevious?: () => void
  onInputChange?: (hasChanged: boolean) => void
  className?: string
  children: React.ReactNode
}

/**
 * WizardStep Component
 *
 * Wrapper for individual wizard step content.
 * Handles:
 * - Step content rendering
 * - Auto-advance after selection
 * - Debounced input tracking
 * - Keyboard navigation
 */
export const WizardStep: React.FC<WizardStepProps> = ({
  stepNumber,
  title,
  subtitle,
  icon,
  isActive,
  isComplete,
  autoAdvance = false,
  autoAdvanceDelay = 800,
  onNext,
  onPrevious,
  onInputChange,
  className = '',
  children,
}) => {
  // Track if user has made changes (for auto-advance)
  const [hasChanges, setHasChanges] = React.useState(false)
  const debouncedHasChanges = useDebounce(hasChanges, 300)

  // Notify parent of changes (debounced)
  useEffect(() => {
    if (onInputChange) {
      onInputChange(debouncedHasChanges)
    }
  }, [debouncedHasChanges, onInputChange])

  // Auto-advance when step is complete (if enabled)
  useEffect(() => {
    if (autoAdvance && isComplete && hasChanges && onNext) {
      const timer = setTimeout(() => {
        onNext()
      }, autoAdvanceDelay)

      return () => clearTimeout(timer)
    }

    return undefined
  }, [autoAdvance, isComplete, hasChanges, onNext, autoAdvanceDelay])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) {
        return
      }

      switch (e.key) {
        case 'Enter':
          if (isComplete && onNext) {
            e.preventDefault()
            onNext()
          }
          break
        case 'Backspace':
          if (onPrevious && stepNumber > 1) {
            e.preventDefault()
            onPrevious()
          }
          break
        default:
          break
      }
    },
    [isActive, isComplete, onNext, onPrevious, stepNumber]
  )

  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }

    return undefined
  }, [isActive, handleKeyDown])

  // Track content changes for auto-advance
  const handleContentInteraction = useCallback(() => {
    setHasChanges(true)
  }, [])

  return (
    <motion.div
      className={`wizard-step ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      // Track interactions for auto-advance
      onClick={handleContentInteraction}
      onChange={handleContentInteraction}
      aria-current={isActive ? 'step' : undefined}
      aria-label={`Step ${stepNumber}: ${title}`}
    >
      {/* Step Header - Optional, can be hidden if parent shows it */}
      {(icon || title || subtitle) && (
        <div className="mb-6">
          {icon && <div className="text-4xl mb-3">{icon}</div>}
          {title && <h3 className="text-xl font-bold text-white mb-1">{title}</h3>}
          {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
        </div>
      )}

      {/* Step Content */}
      <div className="wizard-step-content">{children}</div>

      {/* Auto-advance Indicator */}
      {autoAdvance && isComplete && hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2"
        >
          <div className="w-4 h-4 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-success font-medium">
            Auto-advancing in {Math.ceil(autoAdvanceDelay / 1000)}s...
          </span>
        </motion.div>
      )}

      {/* Keyboard Hints */}
      {isActive && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/50">
            <div className="flex items-center gap-4">
              {stepNumber > 1 && onPrevious && (
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20">
                    Backspace
                  </kbd>
                  <span>Previous</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {isComplete && onNext && (
                <div className="flex items-center gap-1">
                  <span>Next</span>
                  <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20">Enter</kbd>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default WizardStep
