import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../../hooks'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

/**
 * Modal - Accessible modal dialog with Framer Motion animations
 * Uses React Portal to render outside normal DOM hierarchy
 *
 * @param isOpen - Control modal visibility
 * @param onClose - Callback when modal should close
 * @param title - Modal title (optional)
 * @param size - Modal size: 'sm' | 'md' | 'lg' | 'xl'
 * @param showCloseButton - Show X close button
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  const { t } = useTranslation(['common'])
  const isMobile = useIsMobile()

  // Swipe-to-close state (mobile only)
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 300], [1, 0])
  const [isDragging, setIsDragging] = useState(false)

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle swipe-to-close (mobile only)
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!isMobile) {
      return
    }

    // Close if swiped down > 150px or velocity > 500
    if (info.offset.y > 150 || info.velocity.y > 500) {
      onClose()
    } else {
      // Snap back
      y.set(0)
    }
    setIsDragging(false)
  }

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
            aria-hidden="true"
          />

          {/* Modal Container - Scrollable */}
          <div
            className="fixed inset-0 z-[9999] overflow-y-auto p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            <div className="min-h-full flex items-center justify-center py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }}
                drag={isMobile ? 'y' : false}
                dragConstraints={{ top: 0, bottom: 300 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                style={{ y, opacity: isMobile ? opacity : 1 }}
                className={`
                  glass-card-strong p-6 sm:p-8 rounded-2xl w-full ${sizeClasses[size]}
                  pointer-events-auto shadow-2xl shadow-accent-primary/20 
                  max-h-[90vh] flex flex-col border-2 border-white/20
                  ${isMobile && isDragging ? 'cursor-grabbing' : ''}
                `}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Swipe indicator - Mobile only */}
                {isMobile && <div className="swipe-indicator" />}

                {/* Header - Fixed */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
                    {title && (
                      <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-white">
                        {title}
                      </h2>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="ml-auto tap-target touch-active no-select p-2 text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                        aria-label={t('common:actions.close_modal')}
                        type="button"
                      >
                        <svg
                          className="w-7 h-7 sm:w-8 sm:h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Content - Scrollable */}
                <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">{children}</div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  // Use portal to render outside normal DOM hierarchy
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}

export default Modal
