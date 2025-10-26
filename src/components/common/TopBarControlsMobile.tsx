/**
 * TopBarControlsMobile - Floating side controls for mobile landing page
 *
 * Features:
 * - Language switcher (flag-only, compact)
 * - Settings/personalization menu
 * - Positioned on right side, vertically centered
 * - Mobile landing page only (not shown on demo routes)
 * - WCAG AAA compliant touch targets (40px minimum)
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { LANGUAGES, type Language } from '../../i18n/config'
import { MobilePersonalizationMenu } from './MobilePersonalizationMenu'

// Import flag SVG components
import GB from 'country-flag-icons/react/3x2/GB'
import NL from 'country-flag-icons/react/3x2/NL'
import ES from 'country-flag-icons/react/3x2/ES'

// Map language codes to flag components
const FLAG_COMPONENTS = {
  en: GB,
  nl: NL,
  es: ES,
} as const

export function TopBarControlsMobile() {
  const { i18n, t } = useTranslation(['common'])
  const location = useLocation()
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const currentLanguage = (i18n.language?.split('-')[0] || 'en') as Language
  const currentLangData = LANGUAGES[currentLanguage] || LANGUAGES.en
  const FlagComponent = FLAG_COMPONENTS[currentLanguage] || GB

  // Only show on landing page (not demo routes)
  const isLandingPage = location.pathname === '/'
  if (!isLandingPage) {
    return null
  }

  const changeLanguage = (lang: Language) => {
    void i18n.changeLanguage(lang)
    setIsLangOpen(false)

    // Track language change
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        previous_language: currentLanguage,
        new_language: lang,
        source: 'mobile_side_controls',
      })
    }
  }

  return (
    <>
      {/* Floating controls - LEFT side (CHANGED FROM RIGHT), vertically centered */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[90] flex flex-col gap-3 md:hidden">
        {/* Language Switcher Button */}
        <motion.button
          onClick={() => {
            setIsLangOpen(!isLangOpen)
            setIsSettingsOpen(false)
          }}
          className="
            w-10 h-10 min-w-[40px] min-h-[40px]
            rounded-xl
            backdrop-blur-xl bg-white/5
            border border-white/10
            shadow-2xl
            flex items-center justify-center
            hover:bg-white/10
            transition-colors
            group overflow-hidden
            p-2
            touch-manipulation
          "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          aria-label={t('common:language_switcher.change_language')}
          aria-expanded={isLangOpen}
          type="button"
        >
          <motion.div
            className="w-full h-full rounded-sm overflow-hidden group-hover:scale-110 transition-transform shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            <FlagComponent title={currentLangData.name} className="w-full h-full object-cover" />
          </motion.div>
        </motion.button>

        {/* Settings Button */}
        <motion.button
          onClick={() => {
            setIsSettingsOpen(!isSettingsOpen)
            setIsLangOpen(false)
          }}
          className="
            w-10 h-10 min-w-[40px] min-h-[40px]
            rounded-xl
            backdrop-blur-xl bg-white/5
            border border-white/10
            shadow-2xl
            flex items-center justify-center
            hover:bg-white/10
            transition-colors
            touch-manipulation
          "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          aria-label={t('common:settings', 'Settings')}
          aria-expanded={isSettingsOpen}
          type="button"
        >
          <Settings className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Language Dropdown - Positioned to the left of button */}
      <AnimatePresence>
        {isLangOpen && (
          <>
            {/* Backdrop - click outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[85] md:hidden"
              onClick={() => setIsLangOpen(false)}
            />

            {/* Language options - NOW TO THE RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="
                fixed left-20 top-1/2 -translate-y-1/2
                z-[90] md:hidden
                bg-slate-900/95 backdrop-blur-xl
                border border-white/10 rounded-xl
                shadow-2xl py-2 min-w-[140px]
              "
            >
              {Object.entries(LANGUAGES).map(([code, data]) => {
                const FlagIcon = FLAG_COMPONENTS[code as Language]
                return (
                  <motion.button
                    key={code}
                    onClick={() => changeLanguage(code as Language)}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    className={`
                      w-full px-3 py-2 text-left flex items-center gap-3 transition-colors
                      ${currentLanguage === code ? 'bg-blue-500/10' : ''}
                      touch-manipulation
                    `}
                    type="button"
                  >
                    {/* SVG Flag */}
                    <div className="w-6 h-4 rounded overflow-hidden shadow-sm flex-shrink-0">
                      <FlagIcon title={data.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Language name */}
                    <span
                      className={`text-sm font-medium ${
                        currentLanguage === code ? 'text-blue-400' : 'text-white/80'
                      }`}
                    >
                      {data.name}
                    </span>

                    {/* Checkmark for current language */}
                    {currentLanguage === code && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 ml-auto text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                    )}
                  </motion.button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Menu (Personalization) - Positioned to the left of button */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            {/* Backdrop - click outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[85] md:hidden"
              onClick={() => setIsSettingsOpen(false)}
            />

            {/* Settings content - NOW TO THE RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="
                fixed left-20 top-1/2 -translate-y-1/2
                z-[90] md:hidden
                bg-slate-900/95 backdrop-blur-xl
                border border-white/10 rounded-xl
                shadow-2xl p-4
                max-w-[280px]
              "
            >
              <MobilePersonalizationMenu />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

