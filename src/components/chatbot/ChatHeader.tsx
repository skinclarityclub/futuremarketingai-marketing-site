import { Minus, X } from 'lucide-react'
import { useCallback, useRef } from 'react'

interface ChatHeaderProps {
  personaName: string
  personaAvatar?: string
  mode: 'floating' | 'embedded'
  messageCount?: number
  messageLimit?: number
  onMinimize?: () => void
  onClose?: () => void
}

export function ChatHeader({
  personaName,
  personaAvatar,
  mode,
  messageCount,
  messageLimit,
  onMinimize,
  onClose,
}: ChatHeaderProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && closeRef.current) {
      closeRef.current.focus()
    }
  }, [])

  const showDemoBadge = messageCount !== undefined && messageLimit !== undefined

  return (
    <div
      role="banner"
      onKeyDown={handleKeyDown}
      className="flex items-center justify-between border-b border-border-primary bg-bg-surface/95 px-4 py-3 backdrop-blur-sm"
    >
      {/* Left side: avatar + persona name + demo badge */}
      <div className="flex items-center gap-2.5">
        {personaAvatar && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border-primary bg-bg-elevated text-sm">
            {personaAvatar}
          </span>
        )}
        <span className="font-sans text-sm font-medium text-text-primary">{personaName}</span>
        {showDemoBadge && (
          <span className="font-mono text-xs text-text-secondary">
            {messageCount}/{messageLimit}
          </span>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {mode === 'floating' && (
          <>
            <button
              type="button"
              onClick={onMinimize}
              aria-label="Minimize chat"
              className="rounded p-1.5 text-text-secondary transition-colors hover:text-text-primary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close chat"
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
