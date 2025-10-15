import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { useIsMobile } from '../../hooks'

/**
 * Industry Options
 */
export interface Industry {
  id: string
  name: string
  icon: string
  color: 'primary' | 'secondary' | 'success' | 'warning'
  description: string
  qualifier?: string // NEW: Proxy indicator qualifier
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce & Retail',
    icon: '🛍️',
    color: 'success',
    description: 'Online stores and retail',
    qualifier: 'Managing multiple sales channels?', // Primary ICP
  },
  {
    id: 'saas',
    name: 'Technology & SaaS',
    icon: '💻',
    color: 'secondary',
    description: 'Software, apps, and tech services',
    qualifier: 'Post-PMF, scaling content?', // Primary ICP
  },
  {
    id: 'agency',
    name: 'Marketing Agency',
    icon: '🎨',
    color: 'primary',
    description: 'Marketing & creative agencies',
    qualifier: 'Managing 10+ client campaigns?', // Primary ICP
  },
  {
    id: 'other',
    name: 'Other Industry',
    icon: '🎯',
    color: 'warning',
    description: 'All other industries welcome',
    qualifier: 'Growing fast, need to scale marketing?',
  },
]

interface IndustrySelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (industry: Industry) => void
  selectedIndustry?: Industry | null
  skippable?: boolean
}

/**
 * IndustrySelector - Modal for industry selection
 *
 * Features:
 * - Glassmorphic design matching existing components
 * - Grid layout with industry cards
 * - Framer Motion animations
 * - Mobile responsive
 * - Icons for each industry
 * - Skippable option
 */
export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedIndustry,
  skippable = true,
}) => {
  const { t } = useTranslation(['common'])
  const isMobile = useIsMobile()
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null)

  const handleSelect = (industry: Industry) => {
    onSelect(industry)
    onClose()
  }

  const colorClasses = {
    primary: {
      gradient: 'from-accent-primary/10 via-accent-primary/5 to-transparent',
      border: 'border-accent-primary/20',
      hover: 'hover:border-accent-primary/60 hover:shadow-[0_0_30px_-5px_rgba(100,200,255,0.4)]',
      iconGlow: 'drop-shadow-[0_0_15px_rgba(100,200,255,0.5)]',
    },
    secondary: {
      gradient: 'from-accent-secondary/10 via-accent-secondary/5 to-transparent',
      border: 'border-accent-secondary/20',
      hover: 'hover:border-accent-secondary/60 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]',
      iconGlow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    },
    success: {
      gradient: 'from-success/10 via-success/5 to-transparent',
      border: 'border-success/20',
      hover: 'hover:border-success/60 hover:shadow-[0_0_30px_-5px_rgba(0,255,136,0.4)]',
      iconGlow: 'drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]',
    },
    warning: {
      gradient: 'from-accent-warning/10 via-accent-warning/5 to-transparent',
      border: 'border-accent-warning/20',
      hover: 'hover:border-accent-warning/60 hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.4)]',
      iconGlow: 'drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]',
    },
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={skippable ? onClose : () => {}}
      title={t('common:industry_selector.modal_title')}
      size="xl"
      showCloseButton={skippable}
    >
      <div className="space-y-6">
        {/* Description */}
        <div className="text-center max-w-md mx-auto">
          <p className="text-xl font-semibold text-white mb-3 leading-relaxed">
            {t('common:industry_selector.select_prompt')}
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            {t('common:industry_selector.tailoring_info')}
          </p>
        </div>

        {/* Industry Grid - 2x2 layout for 4 industries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
          <AnimatePresence>
            {INDUSTRIES.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: isMobile ? 0 : index * 0.05, duration: isMobile ? 0.2 : 0.3 }} // Faster on mobile
                whileHover={isMobile ? {} : { scale: 1.02 }} // No hover animation on mobile
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`
                    relative p-8 cursor-pointer transition-all duration-500 touch-active no-select
                    rounded-2xl backdrop-blur-xl
                    bg-gradient-to-br ${colorClasses[industry.color].gradient}
                    border ${colorClasses[industry.color].border}
                    ${colorClasses[industry.color].hover}
                    min-h-[180px]
                    ${
                      selectedIndustry?.id === industry.id
                        ? 'scale-105 border-accent-primary/80 shadow-[0_0_40px_-5px_rgba(100,200,255,0.6)]'
                        : 'hover:scale-[1.02]'
                    }
                    group overflow-hidden
                    shadow-xl
                  `}
                  style={{
                    backgroundColor:
                      selectedIndustry?.id === industry.id
                        ? 'rgba(100, 200, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.2)',
                  }}
                  onClick={() => handleSelect(industry)}
                  onMouseEnter={() => setHoveredIndustry(industry.id)}
                  onMouseLeave={() => setHoveredIndustry(null)}
                >
                  {/* Ambient glow effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${
                        industry.color === 'primary'
                          ? 'rgba(100, 200, 255, 0.3)'
                          : industry.color === 'secondary'
                            ? 'rgba(168, 85, 247, 0.3)'
                            : industry.color === 'success'
                              ? 'rgba(0, 255, 136, 0.3)'
                              : 'rgba(234, 179, 8, 0.3)'
                      }, transparent)`,
                    }}
                  />

                  <div className="text-center relative z-10">
                    {/* Icon */}
                    <motion.div
                      className={`
                        text-6xl mb-4 inline-block
                        ${hoveredIndustry === industry.id ? colorClasses[industry.color].iconGlow : ''}
                        transition-all duration-300
                      `}
                      animate={
                        hoveredIndustry === industry.id
                          ? { scale: 1.15, y: -5 }
                          : { scale: 1, y: 0 }
                      }
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      {industry.icon}
                    </motion.div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                      {industry.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-white/70 mb-3 leading-relaxed">
                      {industry.description}
                    </p>

                    {/* Qualifier - Proxy Indicator */}
                    {industry.qualifier && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs font-semibold text-white/90">{industry.qualifier}</p>
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {selectedIndustry?.id === industry.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent-primary/20 backdrop-blur-sm border border-accent-primary/60 flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5 text-accent-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Skip Button */}
        {skippable && (
          <div className="text-center pt-6 mt-2">
            <button
              onClick={onClose}
              className="text-sm text-white/50 hover:text-white/90 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 group"
            >
              <span>{t('common:industry_selector.skip')}</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default IndustrySelector
