import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

/**
 * CompanySizeSelector - Visual persona cards for company size
 *
 * Replaces generic team size slider with persona-based selection
 * for better user engagement and faster decision making.
 */

export type CompanySize = 'solo' | 'small' | 'growing' | 'enterprise'

export interface CompanySizeSelectorProps {
  value?: CompanySize
  onChange: (size: CompanySize) => void
  className?: string
}

interface SizeOption {
  id: CompanySize
  icon: string
  title: string
  description: string
  teamRange: string
  recommended?: boolean
}

const SIZE_OPTIONS: SizeOption[] = [
  {
    id: 'solo',
    icon: '👤',
    title: 'Solo',
    description: 'Just you or freelancer',
    teamRange: '1 person',
  },
  {
    id: 'small',
    icon: '👥',
    title: 'Small Team',
    description: 'Startup or small business',
    teamRange: '2-10 people',
    recommended: true,
  },
  {
    id: 'growing',
    icon: '🏢',
    title: 'Growing',
    description: 'Scaling business',
    teamRange: '11-50 people',
  },
  {
    id: 'enterprise',
    icon: '🌐',
    title: 'Enterprise',
    description: 'Established company',
    teamRange: '51+ people',
  },
]

/**
 * CompanySizeSelector Component
 *
 * Visual card-based selector for company size with personas.
 * Auto-maps to team size value for calculations.
 */
export const CompanySizeSelector: React.FC<CompanySizeSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation(['calculator'])

  return (
    <div className={`company-size-selector ${className}`}>
      <fieldset>
        <legend className="block text-sm font-semibold text-white/90 mb-2">
          {t('calculator:wizard.company_size.label', 'Company Size')}
          <span className="ml-2 text-red-400" aria-label="required">
            *
          </span>
        </legend>
        <p className="text-xs text-white/70 mb-4" id="company-size-desc">
          {t(
            'calculator:wizard.company_size.description',
            'Select the option that best describes your team'
          )}
        </p>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          role="radiogroup"
          aria-describedby="company-size-desc"
          aria-required="true"
        >
          {SIZE_OPTIONS.map((option) => {
            const isSelected = value === option.id
            const isRecommended = option.recommended

            return (
              <motion.button
                key={option.id}
                onClick={() => onChange(option.id)}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${option.title}, ${option.teamRange}. ${option.description}${isRecommended ? '. Recommended option.' : ''}`}
                className={`relative p-4 rounded-xl text-left transition-all min-h-[88px] ${
                  isSelected
                    ? 'bg-accent-primary/20 border-2 border-accent-primary text-white scale-105'
                    : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Recommended Badge */}
                {isRecommended && !isSelected && (
                  <div className="absolute -top-2 -right-2 bg-accent-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}

                {/* Icon */}
                <div className="text-4xl mb-3">{option.icon}</div>

                {/* Title */}
                <div
                  className={`font-bold mb-1 ${isSelected ? 'text-accent-primary' : 'text-white'}`}
                >
                  {option.title}
                </div>

                {/* Description */}
                <div className="text-xs text-white/70 mb-2">{option.description}</div>

                {/* Team Range */}
                <div className="text-xs font-medium text-white/60">{option.teamRange}</div>

                {/* Selected Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center"
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
      </fieldset>
    </div>
  )
}

/**
 * Helper function to map CompanySize to team size number
 * Used for ROI calculations
 */
export function companySizeToTeamSize(size?: CompanySize): number {
  switch (size) {
    case 'solo':
      return 1
    case 'small':
      return 5 // midpoint of 2-10
    case 'growing':
      return 25 // midpoint of 11-50
    case 'enterprise':
      return 75 // 51+
    default:
      return 5 // default to small team
  }
}

export default CompanySizeSelector
