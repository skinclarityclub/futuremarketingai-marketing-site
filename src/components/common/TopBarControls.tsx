/**
 * TopBarControls - Top-left floating controls
 *
 * Features:
 * - Language switcher with flag-only display
 * - Mobile: Settings menu with personalization options
 * - Context/view switcher (optional)
 * - Minimal, compact design
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, type Language } from '../../i18n/config'
import { useIsMobile } from '../../hooks'
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

export function TopBarControls() {
  const { i18n, t } = useTranslation(['common'])
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const currentLanguage = i18n.language as Language
  const currentLangData = LANGUAGES[currentLanguage] || LANGUAGES.en
  const FlagComponent = FLAG_COMPONENTS[currentLanguage] || GB

  const changeLanguage = (lang: Language) => {
    void i18n.changeLanguage(lang)
    setIsOpen(false)

    // Track language change
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        previous_language: currentLanguage,
        new_language: lang,
      })
    }
  }

  return (
    <motion.div
      className="fixed top-6 left-6 z-[100] flex flex-col gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Language Switcher - Flag Only */}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-xl backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center hover:transition-colors group overflow-hidden p-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={t('common:language_switcher.change_language')}
          aria-expanded={isOpen}
        >
          <motion.div
            className="w-full h-full rounded-md overflow-hidden group-hover:scale-110 transition-transform shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            <FlagComponent title={currentLangData.name} className="w-full h-full object-cover" />
          </motion.div>
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop - click outside to close */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Language options */}
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-full ml-2 bg-dark-card border border-white/10 rounded-xl shadow-2xl py-2 min-w-[140px] z-50"
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
                        ${currentLanguage === code ? 'bg-accent-primary/10' : ''}
                      `}
                    >
                      {/* SVG Flag */}
                      <div className="w-6 h-4 rounded overflow-hidden shadow-sm flex-shrink-0">
                        <FlagIcon title={data.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Language name */}
                      <span
                        className={`text-sm font-medium ${
                          currentLanguage === code ? 'text-accent-primary' : 'text-white/80'
                        }`}
                      >
                        {data.name}
                      </span>

                      {/* Checkmark for current language */}
                      {currentLanguage === code && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 ml-auto text-accent-primary"
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
      </div>

      {/* Mobile: Settings Menu with Personalization Options */}
      {isMobile && <MobilePersonalizationMenu />}
    </motion.div>
  )
}
