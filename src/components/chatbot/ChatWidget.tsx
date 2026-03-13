import { useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePersonaChat } from '../../hooks/usePersonaChat'
import { useChatbotStore } from '../../stores/chatbotStore'
import { FloatingButton } from './FloatingButton'
import { ChatHeader } from './ChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { SuggestedPrompts } from './SuggestedPrompts'

interface ChatWidgetProps {
  mode: 'floating' | 'embedded'
  personaId: string
  personaName?: string
  personaAvatar?: string
  suggestedPrompts?: string[]
  height?: string // embedded mode only, e.g., '500px'
  messageLimit?: number // demo limit, default 15
  pageContext?: { pathname: string }
}

export function ChatWidget({
  mode,
  personaId,
  personaName,
  personaAvatar,
  suggestedPrompts,
  height,
  messageLimit = 15,
  pageContext,
}: ChatWidgetProps) {
  const { messages, sendMessage, status, messageCount, isAtLimit } = usePersonaChat(
    personaId,
    pageContext
  )
  const { isOpen, isMinimized, hasUnread, toggle, close, minimize, markRead } = useChatbotStore()

  // Send handler — uses AI SDK v6 sendMessage({ text })
  const handleSend = useCallback(
    (text: string) => {
      if (isAtLimit) {
        return
      }
      sendMessage({ text })
    },
    [isAtLimit, sendMessage]
  )

  // Mark read when panel opens
  useEffect(() => {
    if (isOpen) {
      markRead()
    }
  }, [isOpen, markRead])

  // Focus management + Escape to close (floating mode)
  useEffect(() => {
    if (mode !== 'floating' || !isOpen || isMinimized) {
      return
    }

    // Focus textarea on open
    const timer = setTimeout(() => {
      const textarea = document.querySelector<HTMLTextAreaElement>(
        '[data-chatwidget-panel] textarea'
      )
      textarea?.focus()
    }, 300) // After animation completes

    // Escape to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mode, isOpen, isMinimized, close])

  // Suggested prompts visibility
  const showPrompts =
    messages.length === 0 && suggestedPrompts && suggestedPrompts.length > 0 && !isAtLimit

  // Demo limit banner
  const limitBanner = isAtLimit && (
    <div className="border-t border-border-primary bg-bg-elevated/80 px-4 py-3 text-center">
      <p className="text-xs text-text-secondary">
        Demo limit reached.{' '}
        <a href="/contact" className="font-medium text-accent-system hover:underline">
          Book a call
        </a>{' '}
        to see the full experience.
      </p>
    </div>
  )

  // ------- FLOATING MODE -------
  if (mode === 'floating') {
    return (
      <>
        <FloatingButton onClick={toggle} hasUnread={hasUnread} isOpen={isOpen} />
        <AnimatePresence>
          {isOpen && !isMinimized && (
            <motion.div
              data-chatwidget-panel
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed z-50 right-6 bottom-24 lg:right-20 lg:top-[10vh] lg:bottom-auto
                         w-[calc(100vw-3rem)] max-w-[420px] h-[70vh] max-h-[600px]
                         bg-bg-surface/95 backdrop-blur-xl
                         border border-border-primary rounded-2xl
                         shadow-2xl shadow-black/40
                         flex flex-col overflow-hidden"
              role="dialog"
              aria-label={`Chat with ${personaName || 'assistant'}`}
              aria-modal="true"
            >
              <ChatHeader
                personaName={personaName || 'Assistant'}
                personaAvatar={personaAvatar}
                mode="floating"
                messageCount={messageCount}
                messageLimit={messageLimit}
                onMinimize={minimize}
                onClose={close}
              />
              <ChatMessages messages={messages} status={status} />
              {showPrompts && (
                <SuggestedPrompts
                  prompts={suggestedPrompts}
                  onSelect={handleSend}
                  disabled={isAtLimit}
                />
              )}
              {limitBanner}
              <ChatInput
                onSend={handleSend}
                disabled={isAtLimit}
                placeholder={isAtLimit ? 'Demo limit reached' : 'Type a message...'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // ------- EMBEDDED MODE -------
  return (
    <div
      style={{ height: height || '500px' }}
      className="flex flex-col bg-bg-surface/95 border border-border-primary rounded-2xl overflow-hidden"
    >
      <ChatHeader
        personaName={personaName || 'Assistant'}
        personaAvatar={personaAvatar}
        mode="embedded"
        messageCount={messageCount}
        messageLimit={messageLimit}
      />
      <ChatMessages messages={messages} status={status} />
      {showPrompts && (
        <SuggestedPrompts prompts={suggestedPrompts} onSelect={handleSend} disabled={isAtLimit} />
      )}
      {limitBanner}
      <ChatInput
        onSend={handleSend}
        disabled={isAtLimit}
        placeholder={isAtLimit ? 'Demo limit reached' : 'Type a message...'}
      />
    </div>
  )
}

export default ChatWidget
