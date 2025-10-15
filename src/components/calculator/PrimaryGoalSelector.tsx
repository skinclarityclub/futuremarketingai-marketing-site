import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

/**
 * PrimaryGoalSelector - Visual cards for primary marketing goal
 *
 * Helps personalize the calculator experience and messaging
 * based on user's primary objective.
 */

export type PrimaryGoal = 'leads' | 'time' | 'scale' | 'costs'

export interface PrimaryGoalSelectorProps {
  value?: PrimaryGoal
  onChange: (goal: PrimaryGoal) => void
  className?: string
}

interface GoalOption {
  id: PrimaryGoal
  icon: string
  title: string
  description: string
  color: string // for visual differentiation
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'leads',
    icon: '🎯',
    title: 'Increase Leads',
    description: 'Generate more qualified leads',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'time',
    icon: '⏱️',
    title: 'Save Time',
    description: 'Automate repetitive tasks',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'scale',
    icon: '📈',
    title: 'Scale Output',
    description: 'Produce more content faster',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'costs',
    icon: '💰',
    title: 'Reduce Costs',
    description: 'Lower marketing expenses',
    color: 'from-orange-500 to-red-500',
  },
]

// Helper to convert Tailwind gradient to CSS
const getGradientStyle = (color: string): string => {
  const colorMap: Record<string, string> = {
    'from-blue-500 to-cyan-500':
      'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)',
    'from-purple-500 to-pink-500':
      'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(236, 72, 153) 100%)',
    'from-green-500 to-emerald-500':
      'linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(16, 185, 129) 100%)',
    'from-orange-500 to-red-500':
      'linear-gradient(135deg, rgb(249, 115, 22) 0%, rgb(239, 68, 68) 100%)',
  }
  return colorMap[color] || 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)'
}

/**
 * PrimaryGoalSelector Component
 *
 * Visual card-based selector for primary marketing goal.
 * Used for personalization and tailored messaging.
 */
export const PrimaryGoalSelector: React.FC<PrimaryGoalSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation(['calculator'])

  return (
    <div className={`primary-goal-selector ${className}`}>
      <fieldset>
        <legend className="block text-sm font-semibold text-white/90 mb-2">
          {t('calculator:wizard.primary_goal.label', 'Primary Goal')}
        </legend>
        <p className="text-xs text-white/70 mb-4" id="primary-goal-desc">
          {t(
            'calculator:wizard.primary_goal.description',
            "What's your main objective? (Optional)"
          )}
        </p>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          role="radiogroup"
          aria-describedby="primary-goal-desc"
          aria-required="false"
        >
          {GOAL_OPTIONS.map((option) => {
            const isSelected = value === option.id

            return (
              <motion.button
                key={option.id}
                onClick={() => onChange(option.id)}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${option.title}: ${option.description}`}
                className={`relative p-4 rounded-xl text-left transition-all overflow-hidden min-h-[88px] ${
                  isSelected
                    ? 'border-2 border-white text-white scale-105'
                    : 'border border-white/10 text-white/80 hover:border-white/30'
                }`}
                style={{
                  background: isSelected
                    ? getGradientStyle(option.color)
                    : 'rgba(255, 255, 255, 0.05)',
                }}
                whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Gradient Overlay (when not selected) */}
                {!isSelected && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 hover:opacity-10 transition-opacity`}
                  />
                )}

                {/* Icon */}
                <div className="text-3xl mb-2 relative z-10">{option.icon}</div>

                {/* Title */}
                <div
                  className={`font-bold mb-1 text-sm relative z-10 ${
                    isSelected ? 'text-white' : 'text-white/90'
                  }`}
                >
                  {option.title}
                </div>

                {/* Description */}
                <div
                  className={`text-xs relative z-10 ${
                    isSelected ? 'text-white/90' : 'text-white/60'
                  }`}
                >
                  {option.description}
                </div>

                {/* Selected Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-20"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Goal-specific hint */}
        {value && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <p className="text-xs text-white/80">
              {value === 'leads' && "💡 We'll focus on showing you lead generation improvements"}
              {value === 'time' && "💡 We'll highlight time savings and automation benefits"}
              {value === 'scale' && "💡 We'll show you how to increase content output"}
              {value === 'costs' && "💡 We'll emphasize cost reduction and ROI"}
            </p>
          </motion.div>
        )}
      </fieldset>
    </div>
  )
}

export default PrimaryGoalSelector
