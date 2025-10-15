/**
 * i18n Configuration
 *
 * Multi-language support for FutureMarketingAI Demo
 * Supports: English (en), Dutch (nl), Spanish (es)
 *
 * Best Practices 2025:
 * - Browser language detection with fallback
 * - Lazy loading translations via HTTP backend
 * - localStorage persistence for user preference
 * - Namespace-based organization by feature
 * - Type-safe translation keys (via TypeScript)
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// Supported languages with flag emojis and fallback codes
export const LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧', code: 'EN', icon: '🌐' },
  nl: { name: 'Nederlands', flag: '🇳🇱', code: 'NL', icon: '🌐' },
  es: { name: 'Español', flag: '🇪🇸', code: 'ES', icon: '🌐' },
} as const

export type Language = keyof typeof LANGUAGES
export const DEFAULT_LANGUAGE: Language = 'en'
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES) as Language[]

// Language detection order
const DETECTION_OPTIONS = {
  // Order of detection methods - localStorage first to respect user choice, then browser
  order: ['localStorage', 'navigator', 'htmlTag'],

  // Keys for localStorage and cookie
  lookupLocalStorage: 'i18nextLng',
  lookupCookie: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',

  // Cache user language
  caches: ['localStorage'],

  // Exclude certain paths from detection
  excludeCacheFor: ['cimode'],

  // Check all fallback languages - this ensures unsupported languages fall back to English
  checkWhitelist: true,

  // Convert language codes: nl-NL → nl, en-US → en
  convertDetectedLanguage: (lng: string) => lng.split('-')[0],
}

i18n
  // Load translations via HTTP
  .use(Backend)

  // Detect user language
  .use(LanguageDetector)

  // Pass i18n instance to react-i18next
  .use(initReactI18next)

  // Initialize i18next
  .init({
    // Fallback language
    fallbackLng: DEFAULT_LANGUAGE,

    // Supported languages
    supportedLngs: SUPPORTED_LANGUAGES,

    // Don't load a fallback
    load: 'languageOnly', // en-US -> en

    // Language detection
    detection: DETECTION_OPTIONS,

    // Debugging (disable in production)
    debug: import.meta.env.DEV,

    // Namespaces
    ns: [
      'common', // Shared UI elements
      'hero', // Hero page
      'calculator', // Calculator page
      'explorer', // Explorer page
      'dashboard', // Dashboard page
      'navigation', // Navigation & menu
      'forms', // Form elements
      'errors', // Error messages
      'analytics', // Analytics labels
      'ai-assistant', // AI chatbot
    ],
    defaultNS: 'common',

    // Translation file loading
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',

      // Add timestamp to bust cache in development
      queryStringParams: import.meta.env.DEV ? { v: Date.now() } : {},

      // Retry loading
      requestOptions: {
        cache: import.meta.env.DEV ? 'no-store' : 'default',
      },
    },

    // Interpolation
    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Custom formatters (modern approach)
    lng: DEFAULT_LANGUAGE,

    // React-specific
    react: {
      // Suspend rendering until translations loaded
      useSuspense: true,

      // Bind i18n instance to context
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',

      // Re-render on language change
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },

    // Return null for missing keys (easier debugging)
    returnNull: false,
    returnEmptyString: false,

    // Handling missing translations
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (lng, ns, key) => {
      if (import.meta.env.DEV) {
        const langStr = Array.isArray(lng) ? lng.join(',') : String(lng)
        console.warn(`Missing translation: [${langStr}] ${ns}:${key}`)
      }
    },
  })

export default i18n
