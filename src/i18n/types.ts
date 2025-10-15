/**
 * TypeScript Types for i18n
 *
 * Provides type-safe translation keys
 */

import 'react-i18next'
import type common from '../../public/locales/en/common.json'
import type hero from '../../public/locales/en/hero.json'
import type navigation from '../../public/locales/en/navigation.json'

// Extend react-i18next module
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      hero: typeof hero
      navigation: typeof navigation
      calculator: typeof common // Placeholder
      explorer: typeof common // Placeholder
      dashboard: typeof common // Placeholder
      forms: typeof common // Placeholder
      errors: typeof common // Placeholder
      analytics: typeof common // Placeholder
    }
  }
}

// Extend Window for gtag and Hotjar
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
    hj?: (...args: any[]) => void
  }
}

export {}
