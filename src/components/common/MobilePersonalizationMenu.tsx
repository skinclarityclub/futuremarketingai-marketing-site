import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Settings, User } from 'lucide-react'
import { IndustrySelector, type Industry } from './IndustrySelector'
import { UserPreferencesModal } from './UserPreferencesModal'
import { usePersonalizationStore } from '../../stores'
import { usePersonalization } from '../../hooks'
import { hotjarEvent, HotjarEvents } from '../../utils/hotjar'

/**
 * MobilePersonalizationMenu - Mobile-optimized settings menu
 *
 * Features:
 * - Industry selector access
 * - User preferences access
 * - Touch-friendly menu items
 * - Slide-in animation
 * - Integrates with TopBarControls
 *
 * Usage:
 * ```tsx
 * <MobilePersonalizationMenu />
 * ```
 */
export const MobilePersonalizationMenu: React.FC = () => {
  const { t } = useTranslation(['common'])
  const { selectedIndustry } = usePersonalizationStore()
  const { changeIndustry } = usePersonalization()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showIndustrySelector, setShowIndustrySelector] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  const displayIcon = selectedIndustry?.icon || '🎯'
  const displayName =
    selectedIndustry?.name || t('common:industry_selector.select_prompt', 'Select Industry')

  const handleIndustryClick = () => {
    setIsMenuOpen(false)
    setShowIndustrySelector(true)
    hotjarEvent(HotjarEvents.OPEN_INDUSTRY_SELECTOR)
  }

  const handlePreferencesClick = () => {
    setIsMenuOpen(false)
    setShowPreferences(true)
    hotjarEvent(HotjarEvents.OPEN_USER_PREFERENCES)
  }

  const handleIndustrySelect = (industry: Industry) => {
    changeIndustry(industry, () => {
      setShowIndustrySelector(false)
    })
  }

  return (
    <>
      {/* Settings Button - Mobile Only */}
      <motion.button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="
          w-12 h-12 rounded-xl
          backdrop-blur-xl border border-white/10
          shadow-2xl
          flex items-center justify-center
          hover:border-accent-primary/40
          transition-all duration-300
        "
        style={{ background: 'rgba(0, 0, 0, 0.4)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('common:accessibility.open_preferences', 'Open settings')}
        aria-expanded={isMenuOpen}
      >
        <Settings
          className={`w-5 h-5 text-white/70 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
        />
      </motion.button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="
                fixed top-20 left-4 z-[100]
                w-[280px]
                bg-bg-surface/95 backdrop-blur-xl
                border border-white/10
                rounded-2xl
                shadow-2xl shadow-black/50
                overflow-hidden
              "
              role="menu"
              aria-label={t(
                'common:accessibility.personalization_settings',
                'Personalization settings'
              )}
            >
              {/* Menu Header */}
              <div className="px-4 py-3 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white">
                  {t('common:personalization.settings_title', 'Settings')}
                </h3>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* Industry Selector */}
                <button
                  onClick={handleIndustryClick}
                  className="
                    w-full px-4 py-3
                    flex items-center gap-3
                    text-left
                    hover:bg-white/5
                    transition-colors
                    min-h-touch
                  "
                  role="menuitem"
                >
                  <div
                    className="
                    flex-shrink-0
                    w-10 h-10
                    rounded-lg
                    bg-gradient-primary/20
                    border border-accent-primary/30
                    flex items-center justify-center
                    text-xl
                  "
                  >
                    {displayIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">
                      {t('common:industry_selector.change_industry', 'Industry')}
                    </div>
                    <div className="text-xs text-white/60 truncate">{displayName}</div>
                  </div>
                  <svg
                    className="w-5 h-5 text-white/40 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* User Preferences */}
                <button
                  onClick={handlePreferencesClick}
                  className="
                    w-full px-4 py-3
                    flex items-center gap-3
                    text-left
                    hover:bg-white/5
                    transition-colors
                    min-h-touch
                  "
                  role="menuitem"
                >
                  <div
                    className="
                    flex-shrink-0
                    w-10 h-10
                    rounded-lg
                    bg-accent-secondary/20
                    border border-accent-secondary/30
                    flex items-center justify-center
                  "
                  >
                    <User className="w-5 h-5 text-accent-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {t('common:preferences.modal_title', 'Preferences')}
                    </div>
                    <div className="text-xs text-white/60">
                      {t('common:personalization.more_preferences', 'Customize your experience')}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-white/40 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <IndustrySelector
        isOpen={showIndustrySelector}
        onClose={() => setShowIndustrySelector(false)}
        onSelect={handleIndustrySelect}
        selectedIndustry={selectedIndustry}
        skippable={true}
      />
      <UserPreferencesModal isOpen={showPreferences} onClose={() => setShowPreferences(false)} />
    </>
  )
}

export default MobilePersonalizationMenu
