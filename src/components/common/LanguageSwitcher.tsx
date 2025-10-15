/**
 * Language Switcher Component
 *
 * Allows users to switch between English, Dutch, and Spanish
 * Persists selection to localStorage
 * Shows current language with flag emoji
 */

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { LANGUAGES, type Language } from '../../i18n/config'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'compact' | 'mobile'
}

export function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get current language - handle both 'en-US' and 'en' formats
  const currentLanguage = (i18n.language?.split('-')[0] || 'en') as Language
  const currentLangData = LANGUAGES[currentLanguage] || LANGUAGES.en

  // Debug log (development only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🌍 LanguageSwitcher - Current language:', i18n.language, '→', currentLanguage)
    }
  }, [i18n.language, currentLanguage])

  // Handle language change
  const changeLanguage = (lang: Language) => {
    void i18n.changeLanguage(lang)
    setIsOpen(false)

    // Track language change in analytics
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        previous_language: currentLanguage,
        new_language: lang,
      })
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Compact variant (just flag + arrow)
  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:border border-white/10 transition-colors"
          aria-label={t('common:language_switcher.change_language')}
        >
          <span className="text-xl">{currentLangData.flag}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 bg-dark-card border border-white/10 rounded-lg shadow-2xl py-2 min-w-[160px] z-50"
            >
              {Object.entries(LANGUAGES).map(([code, data]) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code as Language)}
                  className={`
                    w-full px-4 py-2 text-left flex items-center gap-3 hover:transition-colors
                    ${currentLanguage === code ? 'bg-accent-primary/10 text-accent-primary' : 'text-white/80'}
                  `}
                >
                  <span className="text-xl">{data.flag}</span>
                  <span className="font-medium">{data.name}</span>
                  {currentLanguage === code && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Mobile variant (horizontal buttons)
  if (variant === 'mobile') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {Object.entries(LANGUAGES).map(([code, data]) => (
          <button
            key={code}
            onClick={() => changeLanguage(code as Language)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${
                currentLanguage === code ? 'bg-accent-primary text-dark-bg' : 'text-white/80 hover:'
              }
            `}
          >
            <span className="text-xl mr-2">{data.flag}</span>
            <span>{data.name}</span>
          </button>
        ))}
      </div>
    )
  }

  // Default variant (full dropdown with language name)
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:border border-white/10 transition-colors group"
        aria-label={t('common:language_switcher.change_language')}
        aria-expanded={isOpen}
      >
        <span className="text-xl">{currentLangData.flag}</span>
        <span className="font-medium text-white/90 group-hover:text-white">
          {currentLangData.name}
        </span>
        <svg
          className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 bg-dark-card border border-white/10 rounded-lg shadow-2xl py-2 min-w-[200px] z-50 overflow-hidden"
          >
            {Object.entries(LANGUAGES).map(([code, data]) => (
              <motion.button
                key={code}
                onClick={() => changeLanguage(code as Language)}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className={`
                  w-full px-4 py-3 text-left flex items-center gap-3 transition-colors
                  ${currentLanguage === code ? 'bg-accent-primary/10' : ''}
                `}
              >
                <span className="text-2xl">{data.flag}</span>
                <span
                  className={`font-medium ${
                    currentLanguage === code ? 'text-accent-primary' : 'text-white/80'
                  }`}
                >
                  {data.name}
                </span>
                {currentLanguage === code && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 ml-auto text-accent-primary"
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
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
