'use client'

import { MessageCircle, X } from 'lucide-react'
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
        bg-gradient-to-br from-accent-human to-accent-human/80
        shadow-lg shadow-accent-human/20
        hover:shadow-xl hover:shadow-accent-human/30
        transition-shadow duration-200
        focus:outline-none focus:ring-2 focus:ring-accent-human/50 focus:ring-offset-2 focus:ring-offset-bg-deep
        ${!isOpen && !shouldReduceMotion ? 'animate-breathe' : ''}`}
    >
      {isOpen ? (
        <X className="h-6 w-6 text-white" />
      ) : (
        <MessageCircle className="h-6 w-6 text-white" />
      )}

      {/* Unread badge */}
      {hasUnread && !isOpen && (
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 animate-pulse rounded-full bg-red-500" />
      )}
    </button>
  )
}

export default FloatingButton
