import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import i18n from '../../i18n/config'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // TODO: Log error to error monitoring service (Sentry) in production
    // if (import.meta.env.PROD) {
    //   Sentry.captureException(error, { extra: errorInfo })
    // }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg w-full"
          >
            <div className="glass-card p-8 text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h2 className="text-2xl font-bold text-white mb-2">
                {i18n.t('common:errors.something_went_wrong', 'Something went wrong')}
              </h2>
              <p className="text-white/70 mb-6">
                {i18n.t(
                  'common:errors.unexpected_error',
                  'An unexpected error occurred. We have logged this issue and are working on a solution.'
                )}
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-white/50 hover:text-white/70 mb-2">
                    {i18n.t(
                      'common:errors.technical_details',
                      'Technical details (development only)'
                    )}
                  </summary>
                  <div className="p-4 bg-black/30 rounded-lg text-xs font-mono text-left overflow-auto max-h-48">
                    <p className="text-red-400 mb-2 font-semibold">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="text-white/60 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold rounded-lg transition-colors"
                >
                  {i18n.t('common:errors.try_again', 'Try again')}
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="px-6 py-3 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors"
                >
                  {i18n.t('common:errors.go_home', 'Go to home')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Async Error Boundary Wrapper
 *
 * For components that load asynchronously (lazy loaded)
 */
export const AsyncErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Don't use translation in error boundary to avoid circular dependency issues
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/70 mb-4">Component could not be loaded</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
