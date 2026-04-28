'use client'

import { X } from 'lucide-react'
import { useReducedMotion } from 'motion/react'

interface FloatingButtonProps {
  onClick: () => void
  hasUnread?: boolean
  isOpen?: boolean
}

export function FloatingButton({
  onClick,
  hasUnread = false,
  isOpen = false,
}: FloatingButtonProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <button
      type="button"
      role="button"
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      className={`fixed z-[61] right-6 bottom-6 lg:right-8 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2
        flex h-14 w-14 items-center justify-center rounded-full
        bg-accent-system text-bg-deep
        shadow-lg shadow-accent-system/20
        hover:shadow-xl hover:shadow-accent-system/30 hover:scale-105
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-accent-system/50 focus:ring-offset-2 focus:ring-offset-bg-deep
        ${!isOpen && !shouldReduceMotion ? 'animate-breathe' : ''}`}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        // Inline speech-bubble SVG matches FloatingChatTrigger placeholder so
        // the icon stays identical before and after ChatWidget hydration.
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}

      {/* Unread badge */}
      {hasUnread && !isOpen && (
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 animate-pulse rounded-full bg-red-500" />
      )}
    </button>
  )
}

export default FloatingButton
