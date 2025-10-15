import React, { createContext, useContext } from 'react'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/common/Toast'
import type { Toast } from '../hooks/useToast'

interface ToastContextType {
  toasts: Toast[]
  showToast: (toast: Omit<Toast, 'id'>) => string
  showSuccess: (message: string, duration?: number) => string
  showError: (message: string, duration?: number) => string
  showWarning: (message: string, duration?: number) => string
  showInfo: (message: string, duration?: number) => string
  dismissToast: (id: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextType | null>(null)

/**
 * ToastProvider - Global toast notification provider
 *
 * Wrap your app with this provider to enable toast notifications throughout
 *
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast()

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.dismissToast} />
    </ToastContext.Provider>
  )
}

/**
 * useToastContext - Access toast notification methods
 *
 * Must be used within ToastProvider
 *
 * @example
 * const { showSuccess, showError } = useToastContext();
 *
 * showSuccess('Saved successfully!');
 * showError('Failed to save');
 */
export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }

  return context
}

export default ToastProvider
