'use client'

import { Brain, SquarePen, X } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'
import { useChatbotStore } from '@/stores/chatbotStore'
import { MEMORY_FIELD_ORDER } from '@/lib/chatbot/memory'
import { useChatChrome } from './useChatChrome'

interface ChatHeaderProps {
  personaName: string
  personaAvatar?: string
  mode: 'floating' | 'embedded'
  messageCount?: number
  messageLimit?: number
  onClose?: () => void
  onNewChat?: () => void
  badge?: string
  showLimit?: boolean
  hasMessages?: boolean
}

/**
 * ChatHeader -- presence + chrome of the chat panel.
 *
 * One row: brand-mark (LogoSynapse) + name + "AI" pill. The pill is the
 * EU AI Act art. 50(1) disclosure; the old "online" subline was decoration.
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
  onClose,
  onNewChat,
  badge,
  showLimit = true,
  hasMessages = false,
}: ChatHeaderProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const chrome = useChatChrome()
  const memoryProfile = useChatbotStore((s) => s.memoryProfile)
  const openSidePanel = useChatbotStore((s) => s.openSidePanel)
  // How many facts Clyde currently remembers; drives whether the badge shows + its count.
  const memoryCount = MEMORY_FIELD_ORDER.filter((k) => {
    const v = memoryProfile[k]
    return v !== undefined && v !== null && String(v).trim() !== ''
  }).length

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
      className="flex items-center justify-between border-b border-border-primary bg-bg-surface/95 px-4 py-2.5 backdrop-blur-sm"
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
        </span>
        <span className="font-display text-sm font-semibold text-text-primary">{personaName}</span>
        <span className="rounded-md border border-accent-system/30 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-accent-system">
          {chrome.aiLabel}
        </span>
        {badge ? <span className="text-xs text-text-faint">{badge.toLowerCase()}</span> : null}
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
            {memoryCount > 0 && (
              <button
                type="button"
                aria-label={chrome.memoryAriaCount(memoryCount)}
                onClick={() => openSidePanel('remember_context', { remembered: memoryProfile })}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-accent-system transition-colors hover:bg-accent-system/10"
              >
                <Brain className="h-4 w-4" />
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent-system px-1 text-[9px] font-bold text-bg-deep"
                >
                  {memoryCount}
                </span>
              </button>
            )}
            {hasMessages && onNewChat && (
              <button
                type="button"
                onClick={onNewChat}
                aria-label={chrome.newChatAria}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary"
              >
                <SquarePen className="h-4 w-4" />
              </button>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={chrome.closeAria}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary"
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
