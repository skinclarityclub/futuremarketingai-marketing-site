/**
 * Analytics Validation Utility
 *
 * This module provides tools to validate and test analytics tracking integrity.
 * Use this to verify that GA4 and Hotjar are correctly capturing events.
 */

import { isGA4Ready } from './ga4'
import { isHotjarReady, getHotjarUserId } from './hotjar'
import { isIntegrationReady, getSyncedHotjarUserId } from './analytics-integration'

const IS_PRODUCTION = import.meta.env.PROD

/**
 * Validation results interface
 */
export interface ValidationResult {
  passed: boolean
  message: string
  details?: any
}

/**
 * Complete validation report
 */
export interface ValidationReport {
  timestamp: string
  environment: 'development' | 'production'
  ga4: {
    initialized: boolean
    measurementId?: string
    ready: boolean
  }
  hotjar: {
    initialized: boolean
    siteId?: string
    ready: boolean
    userId?: string | null
  }
  integration: {
    active: boolean
    userIdSynced: boolean
    hotjarUserId?: string | null
  }
  tests: ValidationResult[]
  summary: {
    total: number
    passed: number
    failed: number
    warnings: number
  }
}

/**
 * Check if GA4 is properly initialized
 */
export const validateGA4Initialization = (): ValidationResult => {
  const isReady = isGA4Ready()
  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID

  if (!measurementId) {
    return {
      passed: false,
      message: 'GA4 Measurement ID not configured',
      details: { env: 'VITE_GA4_MEASUREMENT_ID is missing' },
    }
  }

  if (!isReady) {
    return {
      passed: false,
      message: 'GA4 not initialized',
      details: { measurementId },
    }
  }

  return {
    passed: true,
    message: 'GA4 initialized successfully',
    details: { measurementId },
  }
}

/**
 * Check if Hotjar is properly initialized
 */
export const validateHotjarInitialization = (): ValidationResult => {
  const isReady = isHotjarReady()
  const siteId = import.meta.env.VITE_HOTJAR_ID

  if (!siteId) {
    return {
      passed: false,
      message: 'Hotjar Site ID not configured',
      details: { env: 'VITE_HOTJAR_ID is missing' },
    }
  }

  if (!isReady) {
    return {
      passed: false,
      message: 'Hotjar not initialized',
      details: { siteId },
    }
  }

  const userId = getHotjarUserId()

  return {
    passed: true,
    message: 'Hotjar initialized successfully',
    details: { siteId, userId },
  }
}

/**
 * Check if GA4 ↔ Hotjar integration is active
 */
export const validateIntegration = (): ValidationResult => {
  const integrationActive = isIntegrationReady()
  const hotjarUserId = getSyncedHotjarUserId()

  if (!integrationActive) {
    return {
      passed: false,
      message: 'GA4 ↔ Hotjar integration not active',
      details: { integrationActive },
    }
  }

  if (!hotjarUserId) {
    return {
      passed: false,
      message: 'Hotjar User ID not synced to GA4',
      details: { hotjarUserId: null },
    }
  }

  return {
    passed: true,
    message: 'GA4 ↔ Hotjar integration active',
    details: { hotjarUserId },
  }
}

/**
 * Check analytics enable flag
 */
export const validateAnalyticsEnabled = (): ValidationResult => {
  const enabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

  if (!enabled) {
    return {
      passed: false,
      message: 'Analytics disabled (VITE_ENABLE_ANALYTICS !== "true")',
      details: { flag: import.meta.env.VITE_ENABLE_ANALYTICS },
    }
  }

  return {
    passed: true,
    message: 'Analytics enabled',
    details: { flag: 'true' },
  }
}

/**
 * Validate environment configuration
 */
export const validateEnvironment = (): ValidationResult => {
  const requiredVars = ['VITE_GA4_MEASUREMENT_ID', 'VITE_HOTJAR_ID', 'VITE_ENABLE_ANALYTICS']

  const missing = requiredVars.filter((varName) => !import.meta.env[varName])

  if (missing.length > 0) {
    return {
      passed: false,
      message: 'Missing required environment variables',
      details: { missing },
    }
  }

  return {
    passed: true,
    message: 'All environment variables configured',
    details: {
      ga4_id: import.meta.env.VITE_GA4_MEASUREMENT_ID,
      hotjar_id: import.meta.env.VITE_HOTJAR_ID,
      analytics_enabled: import.meta.env.VITE_ENABLE_ANALYTICS,
    },
  }
}

/**
 * Run all validation tests
 */
export const runValidation = (): ValidationReport => {
  const tests: ValidationResult[] = [
    validateEnvironment(),
    validateAnalyticsEnabled(),
    validateGA4Initialization(),
    validateHotjarInitialization(),
    validateIntegration(),
  ]

  const summary = {
    total: tests.length,
    passed: tests.filter((t) => t.passed).length,
    failed: tests.filter((t) => !t.passed).length,
    warnings: 0,
  }

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    environment: IS_PRODUCTION ? 'production' : 'development',
    ga4: {
      initialized: isGA4Ready(),
      measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
      ready: isGA4Ready(),
    },
    hotjar: {
      initialized: isHotjarReady(),
      siteId: import.meta.env.VITE_HOTJAR_ID,
      ready: isHotjarReady(),
      userId: getHotjarUserId(),
    },
    integration: {
      active: isIntegrationReady(),
      userIdSynced: !!getSyncedHotjarUserId(),
      hotjarUserId: getSyncedHotjarUserId(),
    },
    tests,
    summary,
  }

  return report
}

/**
 * Print validation report to console
 */
export const logValidationReport = (report: ValidationReport): void => {
  console.group('📊 Analytics Validation Report')
  console.log(`Timestamp: ${report.timestamp}`)
  console.log(`Environment: ${report.environment}`)
  console.log('')

  console.group('🔍 Platform Status')
  console.log(`GA4: ${report.ga4.ready ? '✅ Ready' : '❌ Not Ready'}`)
  console.log(`  - Measurement ID: ${report.ga4.measurementId || 'Not configured'}`)
  console.log(`Hotjar: ${report.hotjar.ready ? '✅ Ready' : '❌ Not Ready'}`)
  console.log(`  - Site ID: ${report.hotjar.siteId || 'Not configured'}`)
  console.log(`  - User ID: ${report.hotjar.userId || 'Not available'}`)
  console.log(`Integration: ${report.integration.active ? '✅ Active' : '❌ Inactive'}`)
  console.log(`  - User ID Synced: ${report.integration.userIdSynced ? 'Yes' : 'No'}`)
  console.log(`  - Hotjar User ID: ${report.integration.hotjarUserId || 'None'}`)
  console.groupEnd()
  console.log('')

  console.group('🧪 Validation Tests')
  report.tests.forEach((test, index) => {
    const icon = test.passed ? '✅' : '❌'
    console.log(`${icon} Test ${index + 1}: ${test.message}`)
    if (test.details) {
      console.log('   Details:', test.details)
    }
  })
  console.groupEnd()
  console.log('')

  console.group('📈 Summary')
  console.log(`Total Tests: ${report.summary.total}`)
  console.log(`Passed: ${report.summary.passed} ✅`)
  console.log(`Failed: ${report.summary.failed} ❌`)
  console.groupEnd()

  if (report.summary.failed === 0) {
    console.log('')
    console.log('🎉 All validation tests passed!')
  } else {
    console.log('')
    console.warn('⚠️ Some validation tests failed. Review the details above.')
  }

  console.groupEnd()
}

/**
 * Run validation and log results
 * Useful for manual testing
 */
export const validateAnalytics = (): ValidationReport => {
  const report = runValidation()
  logValidationReport(report)
  return report
}

/**
 * Expose validation function to window for easy console access
 */
if (typeof window !== 'undefined' && !IS_PRODUCTION) {
  ;(window as any).validateAnalytics = validateAnalytics
  console.log('💡 Tip: Run validateAnalytics() in console to check analytics status')
}

export default {
  validateGA4Initialization,
  validateHotjarInitialization,
  validateIntegration,
  validateAnalyticsEnabled,
  validateEnvironment,
  runValidation,
  logValidationReport,
  validateAnalytics,
}
