/**
 * SimplifiedHeroMobile Component
 * 
 * A streamlined, mobile-optimized hero section designed for small screens.
 * Features:
 * - Concise headline (max 10 words)
 * - Single prominent CTA (full-width, 56px height)
 * - Dismissible "Best on Desktop" badge
 * - No complex animations for performance
 * - Touch-optimized interactions
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sparkles, X, Monitor } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

const DESKTOP_BADGE_DISMISSED_KEY = 'fma_desktop_badge_dismissed'

interface SimplifiedHeroMobileProps {
  /** Override default headline (max 10 words enforced) */
  headline?: string
  /** Override default value proposition */
  valueProposition?: string
  /** Override default CTA text */
  ctaText?: string
  /** Override default CTA action */
  onCTAClick?: () => void
  /** Hide the desktop badge entirely */
  hideDesktopBadge?: boolean
}

export const SimplifiedHeroMobile: React.FC<SimplifiedHeroMobileProps> = ({
  headline,
  valueProposition,
  ctaText,
  onCTAClick,
  hideDesktopBadge = false,
}) => {
  const { t } = useTranslation(['landing', 'common'])
  const navigate = useNavigate()
  
  // Desktop badge dismissal state
  const [showDesktopBadge, setShowDesktopBadge] = useState(false)

  useEffect(() => {
    // Check if badge was previously dismissed in this session
    const wasDismissed = sessionStorage.getItem(DESKTOP_BADGE_DISMISSED_KEY)
    setShowDesktopBadge(!wasDismissed && !hideDesktopBadge)
  }, [hideDesktopBadge])

  const handleDismissBadge = () => {
    setShowDesktopBadge(false)
    sessionStorage.setItem(DESKTOP_BADGE_DISMISSED_KEY, 'true')
  }

  const handleCTAClick = () => {
    if (onCTAClick) {
      onCTAClick()
    } else {
      // Default action: navigate to demo
      navigate('/demo')
    }
  }

  // Get translated or custom headline (use same as desktop)
  const getHeadline = () => {
    return headline || t('landing:hero_landing.main_headline', 'Turn content into growth.')
  }

  const getValueProp = () => {
    return valueProposition || t('landing:hero_landing.mobile_value_prop', 
      'AI-powered marketing automation for premium businesses. Start your intelligent growth journey today.'
    )
  }

  const getCTAText = () => {
    return ctaText || t('common:cta.start_free', 'Start Free Demo')
  }

  return (
    <section 
      className="relative min-h-screen flex flex-col justify-center px-6 py-20 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900"
      aria-label="Hero section"
    >
      {/* Dismissible Desktop Badge - Positioned 10vh from top to avoid logo overlap */}
      {showDesktopBadge && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute left-4 right-4 z-10"
          style={{ top: '10vh' }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-400/20">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <p className="text-xs text-blue-200">
                {t('landing:hero_landing.desktop_badge', 'Best experience on desktop')}
              </p>
            </div>
            <button
              onClick={handleDismissBadge}
              className="p-2 rounded hover:bg-white/10 transition-colors touch-manipulation min-h-touch min-w-touch"
              aria-label="Dismiss desktop notification"
            >
              <X className="w-4 h-4 text-blue-300" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content Container */}
      <div className="relative z-0 flex flex-col items-center text-center space-y-8 mt-16">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <Sparkles className="h-4 w-4 text-blue-400" aria-hidden="true" />
          <span className="text-sm font-medium text-white">
            {t('landing:hero_landing.badge', 'AI-Powered Marketing')}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-label="Active status" />
        </motion.div>

        {/* Headline - Same as Desktop */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black text-white leading-tight"
        >
          {getHeadline()}
        </motion.h1>

        {/* Subheadline - Same as Desktop */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-2xl sm:text-3xl font-bold text-blue-300 leading-tight"
        >
          {t('landing:hero_landing.sub_headline', 'On autopilot.')}
        </motion.p>

        {/* Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg text-blue-100/90 max-w-md leading-relaxed"
        >
          {getValueProp()}
        </motion.p>

        {/* CTA Button - Full Width, 56px Height */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full max-w-sm pt-4"
        >
          <Button
            onClick={handleCTAClick}
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 touch-manipulation min-h-touch"
            aria-label={getCTAText()}
          >
            {getCTAText()}
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col items-center gap-3 pt-6 text-sm text-blue-200/70"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{t('landing:hero_landing.trust_1', 'No credit card required')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{t('landing:hero_landing.trust_2', '5-minute setup')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SimplifiedHeroMobile

