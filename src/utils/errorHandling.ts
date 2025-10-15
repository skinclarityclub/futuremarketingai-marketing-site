/**
 * Error Handling Utilities
 *
 * Provides user-friendly error messages and centralized error handling
 */

import { captureException as sentryCaptureException } from '../config/sentry'

/**
 * Error types for categorization
 */
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown',
  PDF_EXPORT = 'pdf_export',
  CLIPBOARD = 'clipboard',
  SHARE = 'share',
  ANALYTICS = 'analytics',
}

/**
 * User-friendly error messages (Dutch)
 */
export const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK]: 'Netwerkfout. Controleer je internetverbinding en probeer het opnieuw.',
  [ErrorType.VALIDATION]:
    'De ingevoerde gegevens zijn ongeldig. Controleer je invoer en probeer het opnieuw.',
  [ErrorType.PERMISSION]: 'Je hebt geen toestemming voor deze actie.',
  [ErrorType.NOT_FOUND]: 'De gevraagde resource kon niet worden gevonden.',
  [ErrorType.SERVER]: 'Er is een serverfout opgetreden. Probeer het later opnieuw.',
  [ErrorType.UNKNOWN]: 'Er is een onverwachte fout opgetreden. Probeer het opnieuw.',
  [ErrorType.PDF_EXPORT]: 'PDF export mislukt. Probeer het opnieuw.',
  [ErrorType.CLIPBOARD]: 'Kopiëren naar klembord mislukt. Probeer het opnieuw.',
  [ErrorType.SHARE]: 'Delen mislukt. Probeer het opnieuw.',
  [ErrorType.ANALYTICS]: 'Analytics tracking niet beschikbaar.',
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(errorType: ErrorType, customMessage?: string): string {
  if (customMessage) {
    return customMessage
  }
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.UNKNOWN]
}

/**
 * Determine error type from error object
 */
export function getErrorType(error: unknown): ErrorType {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection')
    ) {
      return ErrorType.NETWORK
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION
    }
    if (
      message.includes('permission') ||
      message.includes('denied') ||
      message.includes('forbidden')
    ) {
      return ErrorType.PERMISSION
    }
    if (message.includes('not found') || message.includes('404')) {
      return ErrorType.NOT_FOUND
    }
    if (message.includes('server') || message.includes('500') || message.includes('503')) {
      return ErrorType.SERVER
    }
    if (message.includes('pdf')) {
      return ErrorType.PDF_EXPORT
    }
    if (message.includes('clipboard')) {
      return ErrorType.CLIPBOARD
    }
    if (message.includes('share')) {
      return ErrorType.SHARE
    }
  }

  return ErrorType.UNKNOWN
}

/**
 * Handle error with toast notification and Sentry logging
 *
 * @param error - The error object
 * @param showToast - Function to show toast notification
 * @param context - Additional context for Sentry
 * @param customMessage - Optional custom user-friendly message
 */
export function handleError(
  error: unknown,
  showToast: (message: string, duration?: number) => void,
  context?: Record<string, any>,
  customMessage?: string
): void {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Error occurred:', error, context)
  }

  // Capture in Sentry (with context)
  const errorObj = error instanceof Error ? error : new Error(String(error))
  sentryCaptureException(errorObj, {
    tags: {
      errorType: getErrorType(error),
      ...context?.tags,
    },
    extra: {
      ...context,
      originalError: error,
      timestamp: new Date().toISOString(),
    },
  })

  // Show user-friendly message
  const errorType = getErrorType(error)
  const userMessage = getUserFriendlyMessage(errorType, customMessage)
  showToast(userMessage)
}

/**
 * Handle error silently (only log to Sentry, no user notification)
 * Useful for non-critical errors like analytics failures
 */
export function handleSilentError(error: unknown, context?: Record<string, any>): void {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.warn('Silent error occurred:', error, context)
  }

  // Capture in Sentry
  const errorObj = error instanceof Error ? error : new Error(String(error))
  sentryCaptureException(errorObj, {
    level: 'warning',
    tags: {
      silent: true,
      errorType: getErrorType(error),
      ...context?.tags,
    },
    extra: {
      ...context,
      originalError: error,
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Wrap async function with error handling
 *
 * @example
 * const safeExport = withErrorHandling(
 *   exportToPDF,
 *   showErrorToast,
 *   { component: 'Calculator' }
 * );
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  showToast: (message: string, duration?: number) => void,
  context?: Record<string, any>,
  customMessage?: string
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, showToast, context, customMessage)
      throw error // Re-throw for caller to handle if needed
    }
  }) as T
}

/**
 * Safe async wrapper that doesn't re-throw
 * Returns result or undefined on error
 */
export async function trySafe<T>(
  fn: () => Promise<T>,
  showToast: (message: string, duration?: number) => void,
  context?: Record<string, any>,
  customMessage?: string
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    handleError(error, showToast, context, customMessage)
    return undefined
  }
}

export default {
  handleError,
  handleSilentError,
  withErrorHandling,
  trySafe,
  getUserFriendlyMessage,
  getErrorType,
  ErrorType,
  ERROR_MESSAGES,
}
