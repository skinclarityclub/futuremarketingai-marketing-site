import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { IndustrySelector, type Industry } from './IndustrySelector'
import { UserPreferencesModal } from './UserPreferencesModal'
import { usePersonalizationStore } from '../../stores'
import { useIsMobile, usePersonalization } from '../../hooks'
import { hotjarEvent, HotjarEvents } from '../../utils/hotjar'

/**
 * PersonalizationControlBar - Persistent industry selector control
 *
 * Features:
 * - Shows current selected industry with icon
 * - Edit button to change industry
 * - Top-right position (desktop) or top-center (mobile)
 * - Glassmorphic design matching app style
 * - Smooth animations
 * - Always accessible
 *
 * Usage:
 * ```tsx
 * <PersonalizationControlBar />
 * ```
 */
export const PersonalizationControlBar: React.FC = () => {
  const { t } = useTranslation(['common'])
  const isMobile = useIsMobile()
  const { selectedIndustry } = usePersonalizationStore()
  const { changeIndustry } = usePersonalization()
  const [showIndustrySelector, setShowIndustrySelector] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isPrefsHovered, setIsPrefsHovered] = useState(false)

  const handleEditClick = () => {
    setShowIndustrySelector(true)
    // Track opening industry selector
    hotjarEvent(HotjarEvents.OPEN_INDUSTRY_SELECTOR)
  }

  const handlePreferencesClick = () => {
    setShowPreferences(true)
    // Track opening preferences modal
    hotjarEvent(HotjarEvents.OPEN_USER_PREFERENCES)
  }

  const handleIndustrySelect = (industry: Industry) => {
    // Use changeIndustry which includes tracking
    changeIndustry(industry, () => {
      setShowIndustrySelector(false)
    })
  }

  const handleIndustryClose = () => {
    setShowIndustrySelector(false)
  }

  // Always render - even if no industry selected yet
  const displayIcon = selectedIndustry?.icon || '🎯' // Default icon if no industry
  const displayName = selectedIndustry?.name || 'Select Industry'

  return (
    <>
      {/* Desktop - Top Left (below language switcher) */}
      <motion.div
        className={`
          fixed z-40 flex flex-col gap-2
          ${isMobile ? 'top-4 left-1/2 -translate-x-1/2' : 'top-20 left-6'}
        `}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Industry Button - Compact Icon Only - Always visible */}
        <motion.button
          onClick={handleEditClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            backdrop-blur-xl border shadow-2xl
            hover:hover:border-white/20
            transition-all duration-300 group
            ${!selectedIndustry ? 'border-amber-500/50 animate-pulse' : 'border-white/10'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Current industry: ${displayName}. Click to change.`}
        >
          <motion.span
            className="text-2xl group-hover:scale-110 transition-transform"
            animate={isHovered ? { rotate: 5 } : { rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {displayIcon}
          </motion.span>

          {/* Tooltip on hover - Desktop only - Appears to the right */}
          <AnimatePresence>
            {isHovered && !isMobile && (
              <motion.div
                className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg border border-white/10 shadow-xl whitespace-nowrap"
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`text-xs ${!selectedIndustry ? 'text-amber-400 font-semibold' : 'text-white/90'}`}
                >
                  {displayName}
                </div>
                {/* Arrow pointing left */}
                <div
                  className="absolute right-full top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 border-l border-t border-white/10"
                  style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Preferences Button - Same compact style - Always visible (desktop & mobile) */}
        <motion.button
          onClick={handlePreferencesClick}
          onMouseEnter={() => setIsPrefsHovered(true)}
          onMouseLeave={() => setIsPrefsHovered(false)}
          className="
              w-12 h-12 rounded-xl flex items-center justify-center
              backdrop-blur-xl border border-white/10 shadow-2xl
              hover:border-accent-primary/40
              transition-all duration-300 group
            "
          style={{ background: 'rgba(0, 0, 0, 0.4)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={t('common:personalization.open_preferences')}
        >
          <motion.svg
            className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={isPrefsHovered ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </motion.svg>

          {/* Tooltip - appears to the right - Desktop only */}
          <AnimatePresence>
            {isPrefsHovered && !isMobile && (
              <motion.div
                className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg border border-white/10 shadow-xl whitespace-nowrap"
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-xs text-white/90">
                  {t('common:personalization.more_preferences')}
                </div>
                {/* Arrow pointing left */}
                <div
                  className="absolute right-full top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 border-l border-t border-white/10"
                  style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Industry Selector Modal */}
      <IndustrySelector
        isOpen={showIndustrySelector}
        onClose={handleIndustryClose}
        onSelect={handleIndustrySelect}
        selectedIndustry={selectedIndustry}
        skippable={true}
      />

      {/* User Preferences Modal */}
      <UserPreferencesModal isOpen={showPreferences} onClose={() => setShowPreferences(false)} />
    </>
  )
}

export default PersonalizationControlBar
