/**
 * Floating Action Button (FAB)
 *
 * Entry point for the AI Journey Assistant.
 * Positioned at right-middle with breathing animation and context-aware preview to draw attention.
 * Updated: 2025 - Enhanced attention system with preview bubbles
 */

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useChatStore } from '../../stores/chatStore'
import { useFloatingElement } from '../../contexts/FloatingElementContext'
import { breathingAnimation, reducedMotionVariants } from './styles/animations'

interface FloatingActionButtonProps {
  /** Optional custom className */
  className?: string
}

export default function FloatingActionButton({ className = '' }: FloatingActionButtonProps) {
  const { t } = useTranslation(['common'])
  const {
    isOpen,
    hasUnreadMessages,
    openChat: openChatStore,
    closeChat: closeChatStore,
    markAsRead,
  } = useChatStore()
  const { openChat: openChatCoordinator, closeChat: closeChatCoordinator } = useFloatingElement()
  const prefersReducedMotion = useReducedMotion()
  const location = useLocation()

  // Preview bubble state
  const [showPreview, setShowPreview] = useState(false)
  const [previewDismissed, setPreviewDismissed] = useState(false)
  const [hasInitialPulse, setHasInitialPulse] = useState(false)

  // Check if user has ever opened chat (persistent across sessions)
  const hasEverOpenedChat = localStorage.getItem('chatEverOpened') === 'true'
  const hasManuallyDismissedPreview = localStorage.getItem('chatPreviewDismissed') === 'true'

  // Select appropriate animations based on motion preferences
  const breathingVariant = prefersReducedMotion
    ? reducedMotionVariants.breathingAnimation
    : breathingAnimation

  // Context-aware preview message based on current page
  const getContextualMessage = (): string => {
    if (location.pathname === '/') {
      return t('common:chat.preview.home')
    } else if (location.pathname === '/explorer') {
      return t('common:chat.preview.explorer')
    } else if (location.pathname === '/calculator') {
      return t('common:chat.preview.calculator')
    } else if (location.pathname === '/dashboard') {
      return t('common:chat.preview.dashboard')
    }
    return t('common:chat.preview.default')
  }

  // Initial attention pulse on mount - VERY SUBTLE
  useEffect(() => {
    if (!prefersReducedMotion && !isOpen) {
      const timer = setTimeout(() => {
        setHasInitialPulse(true)
      }, 1000) // Delayed start for natural feel

      return () => clearTimeout(timer)
    }
    return undefined
  }, [prefersReducedMotion, isOpen])

  // Show preview bubble after delay - Best practice: only if user hasn't engaged before
  useEffect(() => {
    // Don't show if user has ever opened chat or manually dismissed
    if (hasEverOpenedChat || hasManuallyDismissedPreview) {
      return undefined
    }

    if (!isOpen && !previewDismissed) {
      const showTimer = setTimeout(() => {
        setShowPreview(true)
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(showTimer)
    } else {
      setShowPreview(false)
      return undefined
    }
  }, [isOpen, previewDismissed, location.pathname, hasEverOpenedChat, hasManuallyDismissedPreview])

  // Auto-dismiss preview after 10 seconds (best practice: 5-15s)
  useEffect(() => {
    if (showPreview) {
      const autoDismissTimer = setTimeout(() => {
        setShowPreview(false)
        setPreviewDismissed(true)
      }, 10000) // Auto-dismiss after 10 seconds

      return () => clearTimeout(autoDismissTimer)
    }
    return undefined
  }, [showPreview])

  const handleClick = () => {
    if (isOpen) {
      // Close both
      closeChatStore()
      closeChatCoordinator()
    } else {
      // Open both (coordinator will auto-close modal if needed)
      openChatStore()
      openChatCoordinator()

      // Track that user has opened chat (persistent - best practice)
      localStorage.setItem('chatEverOpened', 'true')
      // Hide preview permanently after first open
      setShowPreview(false)
      setPreviewDismissed(true)
    }

    if (hasUnreadMessages) {
      markAsRead()
    }
  }

  const handlePreviewDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Persistent dismissal - best practice (localStorage)
    localStorage.setItem('chatPreviewDismissed', 'true')
    setPreviewDismissed(true)
    setShowPreview(false)
  }

  return (
    <>
      {/* Context-Aware Preview Bubble - Premium, ultra-smooth entrance */}
      <AnimatePresence>
        {showPreview && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 2,
              transition: { duration: 0.25, ease: [0.19, 1, 0.22, 1] },
            }}
            transition={{
              duration: 0.7,
              ease: [0.19, 1, 0.22, 1], // Premium Apple-like easing
              delay: 0.12,
            }}
            className="fixed right-[88px] top-[65%] -translate-y-1/2 max-w-[220px] md:z-40 z-[9998]"
          >
            {/* Premium Speech Bubble Container */}
            <motion.div
              className="relative bg-gradient-to-br from-purple-600/92 to-blue-600/92 backdrop-blur-2xl text-white text-sm rounded-2xl px-4 py-3.5 border border-white/20"
              style={{
                boxShadow:
                  '0 8px 32px rgba(139, 92, 246, 0.24), 0 2px 8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              }}
              initial={{
                boxShadow:
                  '0 8px 32px rgba(139, 92, 246, 0.24), 0 2px 8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              }}
              animate={{
                boxShadow: [
                  '0 8px 32px rgba(139, 92, 246, 0.24), 0 2px 8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  '0 10px 40px rgba(139, 92, 246, 0.30), 0 4px 12px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  '0 8px 32px rgba(139, 92, 246, 0.24), 0 2px 8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Message */}
              <p className="font-medium leading-relaxed text-white relative z-10">
                {getContextualMessage()}
              </p>

              {/* Premium Curved Tail - Connects to FAB button */}
              <svg
                className="absolute left-full top-1/2 -translate-y-1/2 -ml-px"
                width="16"
                height="20"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(2px 0 4px rgba(139, 92, 246, 0.2))' }}
              >
                {/* Smooth curved tail pointing to FAB */}
                <motion.path
                  d="M 0 8 Q 8 10, 14 10 Q 16 10, 16 10 Q 16 10, 14 10 Q 8 10, 0 12 Z"
                  fill="url(#tailGradient)"
                  initial={{ opacity: 0.92 }}
                  animate={{ opacity: [0.92, 1, 0.92] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Top border */}
                <path
                  d="M 0 8 Q 8 10, 14 10"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="0.5"
                  fill="none"
                />
                {/* Bottom border */}
                <path
                  d="M 0 12 Q 8 10, 14 10"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="0.5"
                  fill="none"
                />
                <defs>
                  <linearGradient id="tailGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.92" />
                    <stop offset="100%" stopColor="rgb(96, 165, 250)" stopOpacity="0.88" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Premium minimal close button */}
              <button
                onClick={handlePreviewDismiss}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white/95 hover:bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-20 backdrop-blur-sm group"
                aria-label="Sluit preview"
              >
                <X
                  size={11}
                  strokeWidth={2.5}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={handleClick}
        variants={breathingVariant}
        initial="initial"
        animate={
          isOpen
            ? 'initial'
            : !hasInitialPulse
              ? {
                  scale: [1, 1.03, 1],
                  transition: {
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1], // Premium easing
                  },
                }
              : 'animate'
        } // Very subtle initial pulse, then gentle breathing
        whileHover="hover"
        whileTap="tap"
        className={`
          group
          fixed right-6 top-[65%] -translate-y-1/2
          md:z-50 z-[9999]
          w-16 h-16 
          bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600
          hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500
          text-white
          rounded-full
          shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70
          flex items-center justify-center
          transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-purple-400/50
          overflow-hidden
          ${className}
        `}
        aria-label={isOpen ? 'Sluit ARIA' : 'Open ARIA - AI Assistant'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-shimmer" />

        {/* Icon with rotation animation */}
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {isOpen ? (
            <X size={28} strokeWidth={2.5} />
          ) : (
            <MessageCircle size={28} strokeWidth={2.5} />
          )}
        </motion.div>

        {/* Unread Badge */}
        {hasUnreadMessages && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center z-20"
            aria-label={t('common:accessibility.new_messages')}
          >
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-2 h-2 bg-white rounded-full"
            />
          </motion.div>
        )}

        {/* Hover Tooltip (fallback) */}
        {!isOpen && !showPreview && (
          <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
            {t('common:chat.tooltip')}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-gray-900/90 border-b-8 border-b-transparent" />
          </div>
        )}
      </motion.button>
    </>
  )
}
