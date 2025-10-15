import { motion } from 'framer-motion'

interface LoadingFallbackProps {
  message?: string
  fullScreen?: boolean
}

/**
 * LoadingFallback - Loading indicator for lazy-loaded components
 *
 * Provides a smooth, branded loading experience with optional full-screen mode
 */
export function LoadingFallback({
  message = 'Loading...',
  fullScreen = false,
}: LoadingFallbackProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
    : 'flex items-center justify-center min-h-[400px]'

  return (
    <div
      className={containerClass}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      <div className="text-center">
        {/* Animated spinner */}
        <motion.div
          className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          aria-hidden="true"
        />

        {/* Loading text */}
        <motion.p
          className="text-blue-200 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingFallback
