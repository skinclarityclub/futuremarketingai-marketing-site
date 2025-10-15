/**
 * Sentry Configuration
 *
 * Real-time error tracking and monitoring configuration.
 * Supports environment-specific DSN management.
 */

import * as Sentry from '@sentry/react'

/**
 * Sentry DSN (Data Source Name) per environment
 * Store these in environment variables for security
 */
const SENTRY_DSN = {
  production: import.meta.env.VITE_SENTRY_DSN_PRODUCTION,
  staging: import.meta.env.VITE_SENTRY_DSN_STAGING,
  development: import.meta.env.VITE_SENTRY_DSN_DEVELOPMENT,
}

/**
 * Current environment detection
 */
const getEnvironment = (): 'production' | 'staging' | 'development' => {
  const hostname = window.location.hostname

  if (hostname === 'futuremarketingai.com' || hostname === 'www.futuremarketingai.com') {
    return 'production'
  }

  if (hostname.includes('staging') || hostname.includes('vercel.app')) {
    return 'staging'
  }

  return 'development'
}

/**
 * Initialize Sentry with environment-specific configuration
 */
export const initializeSentry = (): void => {
  const environment = getEnvironment()
  const dsn = SENTRY_DSN[environment]

  // Only initialize if DSN is configured and not in development
  if (!dsn && environment === 'development') {
    console.info('[Sentry] Skipped initialization in development without DSN')
    return
  }

  if (!dsn) {
    console.warn(`[Sentry] No DSN configured for ${environment} environment`)
    return
  }

  Sentry.init({
    dsn,
    environment,

    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in staging

    // Session Replay
    replaysSessionSampleRate: environment === 'production' ? 0.1 : 0.5,
    replaysOnErrorSampleRate: 1.0, // Always capture replay on error

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Privacy settings for session replay
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Error filtering
    beforeSend(event, hint) {
      // Don't send errors in development unless explicitly enabled
      if (environment === 'development' && !import.meta.env.VITE_SENTRY_DEBUG) {
        return null
      }

      // Filter out known non-critical errors
      const error = hint.originalException
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message)

        // Ignore ResizeObserver errors (non-critical)
        if (message.includes('ResizeObserver')) {
          return null
        }

        // Ignore network errors from ad blockers
        if (message.includes('blocked by client') || message.includes('ad blocker')) {
          return null
        }
      }

      return event
    },

    // Ignore specific errors
    ignoreErrors: [
      // Browser extension errors
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',

      // Random plugins/extensions
      "Can't find variable: ZiteReader",
      'jigsaw is not defined',
      'ComboSearch is not defined',

      // Facebook errors
      'fb_xd_fragment',

      // Network errors
      'NetworkError',
      'Failed to fetch',
      'Network request failed',

      // Script loading errors (often from ad blockers)
      'Loading chunk',
      'ChunkLoadError',
    ],

    // Additional configuration
    maxBreadcrumbs: 50,
    attachStacktrace: true,

    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || 'unknown',

    // Debug mode
    debug: environment === 'development' && import.meta.env.VITE_SENTRY_DEBUG === 'true',
  })

  console.info(`[Sentry] Initialized for ${environment} environment`)
}

/**
 * Manually capture an exception
 */
export const captureException = (error: Error, context?: Record<string, any>): void => {
  Sentry.captureException(error, {
    contexts: context ? { additional: context } : undefined,
  })
}

/**
 * Manually capture a message
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): void => {
  Sentry.captureMessage(message, {
    level,
    contexts: context ? { additional: context } : undefined,
  })
}

/**
 * Set user context for error tracking
 */
export const setUserContext = (user: {
  id?: string
  email?: string
  username?: string
  [key: string]: any
}): void => {
  Sentry.setUser(user)
}

/**
 * Clear user context (e.g., on logout)
 */
export const clearUserContext = (): void => {
  Sentry.setUser(null)
}

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (breadcrumb: {
  message: string
  category?: string
  level?: Sentry.SeverityLevel
  data?: Record<string, any>
}): void => {
  Sentry.addBreadcrumb(breadcrumb)
}

/**
 * Set custom context
 */
export const setContext = (key: string, context: Record<string, any>): void => {
  Sentry.setContext(key, context)
}

export default Sentry
