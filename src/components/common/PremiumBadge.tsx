import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from './GlassCard'

/**
 * Premium Service Pillars
 */
export interface PremiumPillar {
  id: string
  title: string
  icon: string
  description: string
  color: 'primary' | 'success' | 'secondary'
  highlight: string
}

export const PREMIUM_PILLARS: PremiumPillar[] = [
  {
    id: 'automation',
    title: '24/7 AI Automation',
    icon: '🤖',
    description: 'Fully automated content creation, research and publishing - without manual work',
    color: 'primary',
    highlight: 'Save 80+ hours per month',
  },
  {
    id: 'research',
    title: 'Research-Driven Strategy',
    icon: '🎯',
    description:
      'Real-time trend forecasting and competitor analysis with Perplexity AI - always ahead of the curve',
    color: 'success',
    highlight: '+340% Ad ROI average',
  },
  {
    id: 'command',
    title: 'Multi-Platform Command',
    icon: '🚀',
    description: 'All brands and platforms in one dashboard - total control and insights',
    color: 'secondary',
    highlight: '99.8% Publishing Success',
  },
  {
    id: 'expert',
    title: 'Personal AI Expert',
    icon: '🤝',
    description:
      'Direct access to your personal AI expert for strategy, implementation and optimization',
    color: 'primary',
    highlight: 'No technical knowledge required',
  },
]

interface PremiumBadgeProps {
  variant?: 'floating' | 'inline' | 'banner'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  expandedByDefault?: boolean
  showLabels?: boolean
  className?: string
}

/**
 * PremiumBadge - Showcases the 4 premium service pillars
 *
 * Displays the core value propositions of FutureMarketingAI in a glassmorphic badge.
 * Can be shown as floating badge, inline component, or banner.
 *
 * @param variant - Display style: 'floating' | 'inline' | 'banner'
 * @param position - Position for floating variant (top-right, top-left, etc.)
 * @param expandedByDefault - Start with expanded view
 * @param showLabels - Show pillar titles in collapsed view
 * @param className - Additional CSS classes
 */
export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  variant = 'floating',
  position = 'top-right',
  expandedByDefault = false,
  showLabels = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(expandedByDefault)
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null)

  // Position classes for floating variant
  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  }

  // Color classes for pillars
  const colorClasses = {
    primary: 'from-accent-primary/20 to-accent-primary/5 border-accent-primary/30',
    success: 'from-accent-success/20 to-accent-success/5 border-accent-success/30',
    secondary: 'from-accent-secondary/20 to-accent-secondary/5 border-accent-secondary/30',
  }

  const glowClasses = {
    primary: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    success: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    secondary: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <motion.div
        className={`fixed ${positionClasses[position]} z-40 ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <GlassCard
          className="cursor-pointer"
          variant="strong"
          glow
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              // Collapsed view - Icons only
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {PREMIUM_PILLARS.map((pillar) => (
                      <motion.div
                        key={pillar.id}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className="text-2xl"
                        title={pillar.title}
                      >
                        {pillar.icon}
                      </motion.div>
                    ))}
                  </div>
                  {showLabels && (
                    <span className="text-xs font-medium text-white/90 whitespace-nowrap">
                      Premium Services
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              // Expanded view - Full details
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 w-80"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-text-primary">Premium Services</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsExpanded(false)
                    }}
                    className="text-white/70 hover:text-text-primary transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  {PREMIUM_PILLARS.map((pillar, index) => (
                    <motion.div
                      key={pillar.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredPillar(pillar.id)}
                      onMouseLeave={() => setHoveredPillar(null)}
                    >
                      <GlassCard
                        className={`p-3 border bg-gradient-to-br transition-all duration-300 ${
                          colorClasses[pillar.color]
                        } ${hoveredPillar === pillar.id ? glowClasses[pillar.color] : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{pillar.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-text-primary mb-1">
                              {pillar.title}
                            </h4>
                            <p className="text-xs text-white/90 leading-relaxed mb-2">
                              {pillar.description}
                            </p>
                            <div className="text-xs font-medium text-accent-primary">
                              {pillar.highlight}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    )
  }

  // Banner variant
  if (variant === 'banner') {
    return (
      <div className={`w-full ${className}`}>
        <GlassCard className="p-6" variant="subtle">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-center text-lg font-semibold text-text-primary mb-6">
              Premium All-in-One Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PREMIUM_PILLARS.map((pillar, index) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredPillar(pillar.id)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <GlassCard
                    className={`p-4 border bg-gradient-to-br transition-all duration-300 h-full ${
                      colorClasses[pillar.color]
                    } ${hoveredPillar === pillar.id ? glowClasses[pillar.color] : ''}`}
                    hover
                  >
                    <div className="text-center">
                      <span className="text-4xl block mb-3">{pillar.icon}</span>
                      <h4 className="text-base font-semibold text-text-primary mb-2">
                        {pillar.title}
                      </h4>
                      <p className="text-sm text-white/90 leading-relaxed mb-3">
                        {pillar.description}
                      </p>
                      <div className="text-sm font-medium text-accent-primary">
                        {pillar.highlight}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  // Inline variant
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap gap-3 justify-center">
        {PREMIUM_PILLARS.map((pillar, index) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredPillar(pillar.id)}
            onMouseLeave={() => setHoveredPillar(null)}
            className="flex-1 min-w-[200px] max-w-[300px]"
          >
            <GlassCard
              className={`p-4 border bg-gradient-to-br transition-all duration-300 h-full ${
                colorClasses[pillar.color]
              } ${hoveredPillar === pillar.id ? glowClasses[pillar.color] : ''}`}
              hover
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{pillar.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-text-primary mb-1">{pillar.title}</h4>
                  <p className="text-xs text-white/80">{pillar.highlight}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PremiumBadge
