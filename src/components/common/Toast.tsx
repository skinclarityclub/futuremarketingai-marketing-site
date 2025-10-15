import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  onClose: (id: string) => void
}

/**
 * Toast Component - Individual toast notification
 *
 * Displays temporary notifications with different types (success, error, warning, info)
 */
export const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 5000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [id, duration, onClose])

  const typeConfig = {
    success: {
      icon: '✅',
      bgColor: 'bg-green-500/90',
      borderColor: 'border-green-400',
      iconColor: 'text-green-100',
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-500/90',
      borderColor: 'border-red-400',
      iconColor: 'text-red-100',
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-yellow-500/90',
      borderColor: 'border-yellow-400',
      iconColor: 'text-yellow-100',
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-500/90',
      borderColor: 'border-blue-400',
      iconColor: 'text-blue-100',
    },
  }

  const config = typeConfig[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        ${config.bgColor} ${config.borderColor}
        backdrop-blur-sm
        border-2 rounded-lg shadow-2xl
        px-4 py-3 
        min-w-[300px] max-w-[500px]
        flex items-center gap-3
      `}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <span className={`text-2xl ${config.iconColor} flex-shrink-0`} aria-hidden="true">
        {config.icon}
      </span>

      {/* Message */}
      <p className="text-white text-sm font-medium flex-1">{message}</p>

      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        className="tap-target text-white/80 hover:text-white transition-colors flex-shrink-0 -mr-2"
        aria-label="Close notification"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </motion.div>
  )
}

/**
 * ToastContainer - Container for all toast notifications
 *
 * Manages multiple toasts and their lifecycle
 */
export interface ToastContainerProps {
  toasts: Array<Omit<ToastProps, 'onClose'>>
  onClose: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Toast
