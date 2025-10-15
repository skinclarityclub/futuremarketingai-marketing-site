import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { ChannelsCount } from '../../utils/icpScoring'

/**
 * ChannelsSelector - Visual button grid for marketing channels
 *
 * Extracted from Calculator.tsx for reusability in wizard
 */

export interface ChannelsSelectorProps {
  value: ChannelsCount
  onChange: (channels: ChannelsCount) => void
  className?: string
}

interface ChannelOption {
  value: ChannelsCount
  label: string
  description: string
  recommended?: boolean
}

const CHANNEL_OPTIONS: ChannelOption[] = [
  {
    value: '1-2',
    label: '1-2 channels',
    description: 'Starting out',
  },
  {
    value: '3-5',
    label: '3-5 channels',
    description: 'Perfect fit',
    recommended: true,
  },
  {
    value: '6-10',
    label: '6-10 channels',
    description: 'High volume',
    recommended: true,
  },
  {
    value: '10+',
    label: '10+ channels',
    description: 'Enterprise scale',
  },
]

/**
 * ChannelsSelector Component
 *
 * Visual button grid for selecting number of marketing channels.
 * Helps determine ICP score and personalization.
 */
export const ChannelsSelector: React.FC<ChannelsSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation(['calculator'])

  return (
    <div className={`channels-selector ${className}`}>
      <fieldset>
        <legend className="block text-sm font-semibold text-white/90 mb-2">
          {t('calculator:inputs.channels.label', 'Marketing Channels')}
          <span className="ml-2 text-red-400" aria-label="required">
            *
          </span>
        </legend>
        <p className="text-xs text-white/70 mb-3" id="channels-desc">
          {t('calculator:inputs.channels.description', 'How many channels do you actively manage?')}
        </p>

        <div
          className="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-describedby="channels-desc"
          aria-required="true"
        >
          {CHANNEL_OPTIONS.map((option) => {
            const isSelected = value === option.value
            const isRecommended = option.recommended

            return (
              <motion.button
                key={option.value}
                onClick={() => onChange(option.value)}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${option.label}: ${option.description}${isRecommended ? '. Sweet spot.' : ''}`}
                className={`p-4 rounded-xl text-left transition-all min-h-[88px] ${
                  isSelected
                    ? option.value === '3-5' || option.value === '6-10'
                      ? 'bg-accent-secondary/20 border-2 border-accent-secondary text-white'
                      : 'bg-accent-primary/20 border-2 border-accent-primary text-white'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: isSelected ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRecommended && !isSelected && (
                  <div className="absolute -top-2 -right-2 bg-accent-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                    Sweet spot
                  </div>
                )}

                <div className="font-bold">{option.label}</div>
                <div className="text-xs mt-1 text-white/60">{option.description}</div>

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

export default ChannelsSelector
