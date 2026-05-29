'use client'

import { Minus, SquarePen, X } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'

interface ChatHeaderProps {
  personaName: string
  personaAvatar?: string
  mode: 'floating' | 'embedded'
  messageCount?: number
  messageLimit?: number
  onMinimize?: () => void
  onClose?: () => void
  onNewChat?: () => void
  badge?: string
  showLimit?: boolean
  hasMessages?: boolean
}

/**
 * ChatHeader -- presence + chrome of the chat panel.
 *
 * Carries the same brand-mark (LogoSynapse) + name + status as the
 * entry-pill so the identity is continuous when the panel opens. The
 * status-dot signals "online" with a subtle pulse and bridges back to
 * the "nu online" copy on the pill.
 *
 * `personaAvatar` (emoji fallback) is preserved for non-Clyde personas
 * (embedded usage on flagship landing pages); for Clyde it's overridden
 * by the LogoSynapse mark.
 */
export function ChatHeader({
  personaName,
  personaAvatar,
  mode,
  messageCount,
  messageLimit,
  onMinimize,
  onClose,
  onNewChat,
  badge,
  showLimit = true,
  hasMessages = false,
}: ChatHeaderProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && closeRef.current) {
      closeRef.current.focus()
    }
  }, [])

  const showDemoBadge = showLimit && messageCount !== undefined && messageLimit !== undefined
  const isClyde = personaName === 'Clyde'

  return (
    <div
      role="banner"
      onKeyDown={handleKeyDown}
      className="flex items-center justify-between border-b border-border-primary bg-bg-surface/95 px-4 py-3.5 backdrop-blur-sm"
    >
      {/* Brand-mark + name + status */}
      <div className="flex items-center gap-3">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-accent-system/30 bg-bg-elevated">
          {isClyde ? (
            <LogoSynapse size={22} ariaLabel="" />
          ) : personaAvatar ? (
            <span className="text-base">{personaAvatar}</span>
          ) : (
            <LogoSynapse size={22} ariaLabel="" />
          )}
          {/* online status dot, bottom-right with halo */}
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-active opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-bg-surface bg-status-active" />
          </span>
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-sm font-semibold text-text-primary">
            {personaName}
          </span>
          <span className="text-xs text-text-secondary">
            Nu online
            {badge ? <span className="text-text-faint"> · {badge.toLowerCase()}</span> : null}
          </span>
        </div>
        {showDemoBadge && (
          <span className="ml-1 font-mono text-xs text-text-secondary">
            {messageCount}/{messageLimit}
          </span>
        )}
      </div>

      {/* Chrome */}
      <div className="flex items-center gap-1">
        {mode === 'floating' && (
          <>
            {hasMessages && onNewChat && (
              <button
                type="button"
                onClick={onNewChat}
                aria-label="Nieuwe chat starten"
                className="rounded p-1.5 text-text-secondary transition-colors hover:text-text-primary"
              >
                <SquarePen className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onMinimize}
              aria-label="Minimaliseer chat"
              className="rounded p-1.5 text-text-secondary transition-colors hover:text-text-primary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Sluit chat"
              className="rounded p-1.5 text-text-secondary transition-colors hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
        {mode === 'embedded' && showDemoBadge && (
          <span className="font-mono text-xs text-text-secondary">Demo</span>
        )}
      </div>
    </div>
  )
}

export default ChatHeader
