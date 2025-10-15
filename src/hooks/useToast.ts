import { useState, useCallback } from 'react'
import type { ToastType } from '../components/common/Toast'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

/**
 * useToast Hook - Manage toast notifications
 *
 * Provides methods to show, update, and dismiss toast notifications
 *
 * @example
 * const { showToast, showError, showSuccess } = useToast();
 *
 * showSuccess('Changes saved!');
 * showError('Failed to save changes');
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  /**
   * Show a toast notification
   */
  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: Toast = { id, ...toast }

    setToasts((prev) => [...prev, newToast])

    return id
  }, [])

  /**
   * Show a success toast
   */
  const showSuccess = useCallback(
    (message: string, duration = 5000) => {
      return showToast({ type: 'success', message, duration })
    },
    [showToast]
  )

  /**
   * Show an error toast
   */
  const showError = useCallback(
    (message: string, duration = 7000) => {
      return showToast({ type: 'error', message, duration })
    },
    [showToast]
  )

  /**
   * Show a warning toast
   */
  const showWarning = useCallback(
    (message: string, duration = 6000) => {
      return showToast({ type: 'warning', message, duration })
    },
    [showToast]
  )

  /**
   * Show an info toast
   */
  const showInfo = useCallback(
    (message: string, duration = 5000) => {
      return showToast({ type: 'info', message, duration })
    },
    [showToast]
  )

  /**
   * Dismiss a specific toast
   */
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  /**
   * Dismiss all toasts
   */
  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    dismissAll,
  }
}

export default useToast
