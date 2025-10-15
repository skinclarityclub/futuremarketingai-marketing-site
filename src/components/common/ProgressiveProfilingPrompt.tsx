import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GlassCard } from './GlassCard'
import { Button } from './Button'
import { usePersonalizationStore } from '../../stores'
import { useIsMobile } from '../../hooks'

export type ProfileQuestion = 'companySize' | 'role' | 'budget' | 'painPoints' | 'useCases'

interface ProgressiveProfilingPromptProps {
  question: ProfileQuestion
  onComplete?: () => void
  onDismiss?: () => void
}

// Icon mapping (static, not translated)
const ICONS: Record<string, string> = {
  // Company size
  small: '👤',
  medium: '👥',
  large: '👨‍👩‍👧‍👦',
  enterprise: '🏢',
  // Roles
  owner: '👔',
  cmo: '📊',
  manager: '📈',
  specialist: '💡',
  other: '🎯',
  // Budget
  low: '💰',
  'medium-budget': '💰💰',
  high: '💰💰💰',
  // Pain points
  time: '⏰',
  headcount: '👥',
  consistency: '📉',
  scaling: '📈',
  cost: '💸',
  complexity: '🔧',
  // Use cases
  content: '✍️',
  ads: '📢',
  social: '📱',
  email: '📧',
  seo: '🔍',
  analytics: '📊',
}

/**
 * ProgressiveProfilingPrompt
 *
 * Non-intrusive prompt that appears at strategic moments to collect
 * additional user profile data. Features:
 * - Single or multi-select questions
 * - Dismissible (stores dismissal in localStorage)
 * - Saves responses to personalization store
 * - Animated entrance/exit
 *
 * Usage:
 * ```tsx
 * <ProgressiveProfilingPrompt
 *   question="companySize"
 *   onComplete={() => console.log('Profile updated')}
 *   onDismiss={() => console.log('User dismissed')}
 * />
 * ```
 */
export const ProgressiveProfilingPrompt: React.FC<ProgressiveProfilingPromptProps> = ({
  question,
  onComplete,
  onDismiss,
}) => {
  const { t } = useTranslation(['profiling'])
  const { updateUserProfile } = usePersonalizationStore()
  const isMobile = useIsMobile()

  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [isDismissed, setIsDismissed] = useState(false)

  // Dynamically build question config from translations
  const config = useMemo(() => {
    const optionKeys = Object.keys(
      t(`profiling:questions.${question}.options`, { returnObjects: true }) as Record<
        string,
        string
      >
    )
    const isMultiSelect = question === 'painPoints' || question === 'useCases'

    return {
      title: t(`profiling:questions.${question}.title`),
      subtitle: t(`profiling:questions.${question}.subtitle`),
      multiSelect: isMultiSelect,
      options: optionKeys.map((key) => ({
        value: key,
        label: t(`profiling:questions.${question}.options.${key}`),
        icon: ICONS[key] || ICONS[`${key}-budget`] || undefined,
      })),
    }
  }, [question, t])

  const handleSelect = (value: string) => {
    if (config.multiSelect) {
      setSelectedValues((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      )
    } else {
      setSelectedValues([value])
    }
  }

  const handleSubmit = () => {
    // Update profile in store
    if (question === 'companySize') {
      updateUserProfile({ companySize: selectedValues[0] as any })
    } else if (question === 'role') {
      updateUserProfile({ role: selectedValues[0] as any })
    } else if (question === 'budget') {
      updateUserProfile({ budget: selectedValues[0] as any })
    } else if (question === 'painPoints') {
      updateUserProfile({ painPoints: selectedValues })
    }

    // Mark as completed in localStorage
    localStorage.setItem(`profile_${question}_completed`, 'true')

    // Trigger callback
    onComplete?.()
  }

  const handleDismiss = () => {
    // Mark as dismissed in localStorage
    localStorage.setItem(`profile_${question}_dismissed`, 'true')
    setIsDismissed(true)

    // Trigger callback
    onDismiss?.()
  }

  // Don't render if already dismissed
  if (isDismissed) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: isMobile ? 0.2 : 0.3 }} // Faster on mobile
        className={`
          fixed z-[100] 
          ${
            isMobile
              ? 'bottom-0 left-0 right-0 m-0 max-w-full' // Full width bottom sheet on mobile
              : 'bottom-8 right-8 max-w-md' // Bottom-right card on desktop
          }
        `}
      >
        <GlassCard className="p-6 border-2 border-accent-primary/30 shadow-glow-primary">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{config.title}</h3>
              <p className="text-sm text-white/80">{config.subtitle}</p>
            </div>
            <button
              onClick={handleDismiss}
              className="tap-target text-white/60 hover:text-white transition-colors ml-4"
              aria-label={t('profiling:actions.dismiss')}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {config.options.map((option) => {
              const isSelected = selectedValues.includes(option.value)

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-all duration-200 touch-active
                    ${
                      isSelected
                        ? 'bg-accent-primary/20 border-2 border-accent-primary text-white'
                        : 'border border-white/10 text-white/80 hover:hover:border-white/20'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {option.icon && <span className="text-2xl">{option.icon}</span>}
                    <span className="font-medium">{option.label}</span>
                    {isSelected && config.multiSelect && (
                      <span className="ml-auto text-accent-primary">✓</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={handleDismiss} className="flex-1">
              {t('profiling:actions.skip')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={selectedValues.length === 0}
              glow
              className="flex-1"
            >
              {t('profiling:actions.confirm')}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Helper function to check if a profile question should be shown
 */
export function shouldShowProfilePrompt(question: ProfileQuestion): boolean {
  const completed = localStorage.getItem(`profile_${question}_completed`)
  const dismissed = localStorage.getItem(`profile_${question}_dismissed`)

  return !completed && !dismissed
}
