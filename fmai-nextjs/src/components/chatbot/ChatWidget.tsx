'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import type { UIMessage } from 'ai'
import { useTranslations, useLocale } from 'next-intl'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { usePersonaChat } from '@/hooks/usePersonaChat'
import { useChatbotStore } from '@/stores/chatbotStore'
import { FloatingButton } from './FloatingButton'
import { ChatHeader } from './ChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { SidePanel } from './SidePanel'
import { DemoOrchestrator } from './demo/DemoOrchestrator'
import { DemoProgress } from './demo/DemoProgress'
import { getDemoScenarios } from './demo/scenarios'

interface ChatWidgetProps {
  mode: 'floating' | 'embedded'
  personaId: string
  personaName?: string
  personaAvatar?: string
  suggestedPrompts?: string[]
  height?: string
  messageLimit?: number
  pageContext?: { pathname: string }
  welcomeMessage?: string
  /** Message Clyde sends proactively after 2 min of silence in an active conversation. */
  proactiveFollowupMessage?: string
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
  welcomeMessage,
  proactiveFollowupMessage,
}: ChatWidgetProps) {
  const t = useTranslations('chat.widget')
  const locale = useLocale()
  const {
    messages,
    sendMessage,
    status,
    messageCount,
    isAtLimit,
    stop,
    regenerate,
    setMessages,
  } = usePersonaChat(personaId, pageContext)
  const [editText, setEditText] = useState<string | undefined>(undefined)
  const { isOpen, isMinimized, hasUnread, toggle, close, minimize, markRead } = useChatbotStore()
  const isSidePanelOpen = useChatbotStore((s) => s.isSidePanelOpen)
  const sidePanelContent = useChatbotStore((s) => s.sidePanelContent)
  const closeSidePanel = useChatbotStore((s) => s.closeSidePanel)
  const resetMessageCount = useChatbotStore((s) => s.resetMessageCount)
  const pendingChatMessage = useChatbotStore((s) => s.pendingChatMessage)
  const clearPendingMessage = useChatbotStore((s) => s.clearPendingMessage)
  const demoMode = useChatbotStore((s) => s.demoMode)
  const demoScenarioId = useChatbotStore((s) => s.demoScenarioId)
  const demoStepIndex = useChatbotStore((s) => s.demoStepIndex)
  const startDemo = useChatbotStore((s) => s.startDemo)

  const isFlagship = personaId === 'clyde' || personaId === 'flagship'
  const demoScenario = getDemoScenarios(locale).find((s) => s.id === demoScenarioId)

  const handleSend = useCallback(
    (text: string) => {
      if (isAtLimit) return
      sendMessage({ text })
    },
    [isAtLimit, sendMessage]
  )

  const handlePromptSelect = useCallback(
    (text: string) => {
      if (text === 'Start guided demo') {
        startDemo()
        return
      }
      handleSend(text)
    },
    [handleSend, startDemo]
  )

  /**
   * Edit-flow: restore the user's original text into the input and
   * trim every message from that user-turn onward (including any AI
   * reply we already streamed). User can then tweak and re-send.
   */
  const handleEditMessage = useCallback(
    (messageId: string, text: string) => {
      const idx = messages.findIndex((m) => m.id === messageId)
      if (idx === -1) return
      // Stop any in-flight response so the trim is clean.
      stop?.()
      setMessages?.(messages.slice(0, idx))
      // Tag the text with a timestamp suffix in a wrapper state so the
      // child useEffect always fires, even if user re-edits the exact
      // same string twice in a row.
      setEditText(text)
      // Clear the marker on next tick so the input is a normal
      // controlled component again.
      setTimeout(() => setEditText(undefined), 0)
    },
    [messages, setMessages, stop]
  )

  const handleNewChat = useCallback(() => {
    stop?.()
    setMessages?.([])
    closeSidePanel()
    resetMessageCount(personaId)
    // Keep the persistent memory profile: only "Wis geheugen" clears it (Task 7).
    hasGreeted.current = false
    hasSentFollowup.current = false
  }, [stop, setMessages, closeSidePanel, resetMessageCount, personaId])

  const handleSendRef = useRef(handleSend)
  handleSendRef.current = handleSend

  // Auto-greet: inject Clyde's welcome as a real chat bubble when chat first opens.
  // The hasGreeted flag flips INSIDE the timer, not before scheduling it. In dev,
  // React StrictMode runs effects mount -> cleanup -> remount; the cleanup clears
  // the pending timer, so flipping the flag up-front would make the remount hit the
  // hasGreeted guard and drop the greet for good (the observed "first bubble is the
  // user question" bug). Flipping inside the timer lets the remount — or any
  // dep-identity churn within the 400ms window — reschedule cleanly. Only one timer
  // is ever live (cleanup clears the previous), so the greet fires exactly once.
  const hasGreeted = useRef(false)
  useEffect(() => {
    if (mode !== 'floating' || !isFlagship || !isOpen || messages.length > 0 || hasGreeted.current || !welcomeMessage || demoMode) return
    const timer = setTimeout(() => {
      hasGreeted.current = true
      setMessages?.([{
        id: 'clyde-welcome',
        role: 'assistant',
        content: welcomeMessage,
        parts: [{ type: 'text', text: welcomeMessage }],
      } as UIMessage])
    }, 400)
    return () => clearTimeout(timer)
  }, [isOpen, messages.length, welcomeMessage, setMessages, mode, isFlagship, demoMode])

  // Proactive follow-up: Clyde sends a message after 2 min of silence in active chat
  const hasSentFollowup = useRef(false)
  useEffect(() => {
    if (!proactiveFollowupMessage || !isOpen || messages.length === 0 || hasSentFollowup.current) return
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role === 'user' || status === 'streaming' || status === 'submitted') return
    const timer = setTimeout(() => {
      hasSentFollowup.current = true
      setMessages?.([
        ...messages,
        {
          id: `clyde-followup-${Date.now()}`,
          role: 'assistant',
          content: proactiveFollowupMessage,
          parts: [{ type: 'text', text: proactiveFollowupMessage }],
        } as UIMessage,
      ])
    }, 120_000)
    return () => clearTimeout(timer)
  }, [messages, status, isOpen, proactiveFollowupMessage, setMessages])

  useEffect(() => {
    if (!pendingChatMessage || isAtLimit) return
    clearPendingMessage()
    handleSendRef.current(pendingChatMessage)
  }, [pendingChatMessage, isAtLimit, clearPendingMessage])

  useEffect(() => {
    if (isOpen) markRead()
  }, [isOpen, markRead])

  useEffect(() => {
    if (mode !== 'floating' || !isOpen || isMinimized) return
    const timer = setTimeout(() => {
      const textarea = document.querySelector<HTMLTextAreaElement>(
        '[data-chatwidget-panel] textarea'
      )
      textarea?.focus()
    }, 300)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mode, isOpen, isMinimized, close])

  const showPrompts =
    messages.length === 0 &&
    suggestedPrompts &&
    suggestedPrompts.length > 0 &&
    !isAtLimit &&
    !demoMode

  // Show prompts inline below auto-greet bubble (only while it's the sole message)
  const showInlinePrompts =
    mode === 'floating' &&
    isFlagship &&
    messages.length === 1 &&
    messages[0]?.role === 'assistant' &&
    suggestedPrompts &&
    suggestedPrompts.length > 0 &&
    !isAtLimit &&
    !demoMode

  const limitBanner = isAtLimit && (
    <div className="border-t border-border-primary bg-bg-elevated/80 px-4 py-3 text-center">
      <p className="text-xs text-text-secondary">
        {t('demoLimitMessage')}{' '}
        <Link href="/contact" className="font-medium text-accent-system hover:underline">
          {t('demoLimitCta')}
        </Link>
      </p>
    </div>
  )

  if (mode === 'floating') {
    return (
      <>
        <FloatingButton onClick={toggle} hasUnread={hasUnread} isOpen={isOpen} />
        <AnimatePresence>
          {isOpen && !isMinimized && (
            <motion.div
              data-chatwidget-panel
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              style={{
                boxShadow:
                  '0 24px 60px -12px rgba(0, 0, 0, 0.6), 0 8px 24px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                transformOrigin: 'bottom right',
              }}
              className="fixed z-[60] right-6 bottom-24 lg:right-6 lg:top-[80px] lg:bottom-6 flex max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-104px)] overflow-hidden rounded-2xl border border-white/[0.08] bg-bg-surface/85 backdrop-blur-2xl"
              role="dialog"
              aria-label={`Chat met ${personaName || 'Clyde'}`}
              aria-modal="true"
            >
              {isFlagship && (
                <SidePanel
                  isOpen={isSidePanelOpen}
                  content={sidePanelContent}
                  onClose={closeSidePanel}
                />
              )}
              <div className="w-[calc(100vw-3rem)] max-w-[480px] min-w-[320px] h-full flex flex-col">
                <ChatHeader
                  personaName={personaName || 'Assistant'}
                  personaAvatar={personaAvatar}
                  mode="floating"
                  messageCount={messageCount}
                  messageLimit={messageLimit}
                  onMinimize={minimize}
                  onClose={close}
                  onNewChat={handleNewChat}
                  hasMessages={messages.length > 0}
                  badge={demoMode ? 'Demo' : isFlagship ? 'Concierge' : undefined}
                  showLimit={!isFlagship}
                />
                {demoMode && demoScenario && (
                  <div className="border-b border-border-primary px-4 py-2 bg-bg-surface/95">
                    <DemoProgress totalSteps={demoScenario.stepCount} currentStep={demoStepIndex} />
                  </div>
                )}
                <ChatMessages
                  messages={messages}
                  status={status}
                  welcomeMessage={welcomeMessage}
                  flagship={isFlagship}
                  onStartDemo={demoMode ? undefined : startDemo}
                  suggestedPrompts={showPrompts ? suggestedPrompts : undefined}
                  onPromptSelect={handlePromptSelect}
                  onRegenerate={regenerate ? () => regenerate() : undefined}
                  onEditMessage={handleEditMessage}
                  inlinePrompts={showInlinePrompts ? suggestedPrompts : undefined}
                  onInlinePromptSelect={handlePromptSelect}
                />
                <DemoOrchestrator
                  chatStatus={status}
                  messageCount={messages.length}
                  onSendMessage={handleSend}
                />
                {limitBanner}
                <ChatInput
                  onSend={handleSend}
                  onStop={stop}
                  disabled={isAtLimit}
                  isLoading={status === 'submitted' || status === 'streaming'}
                  placeholder={isAtLimit ? t('demoLimitReached') : t('typeMessage')}
                  initialText={editText}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

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
        badge={demoMode ? 'Demo' : undefined}
      />
      {demoMode && demoScenario && (
        <div className="border-b border-border-primary px-4 py-2 bg-bg-surface/95">
          <DemoProgress totalSteps={demoScenario.stepCount} currentStep={demoStepIndex} />
        </div>
      )}
      <ChatMessages
        messages={messages}
        status={status}
        welcomeMessage={welcomeMessage}
        onStartDemo={demoMode ? undefined : startDemo}
        suggestedPrompts={showPrompts ? suggestedPrompts : undefined}
        onPromptSelect={handlePromptSelect}
        onRegenerate={regenerate ? () => regenerate() : undefined}
        onEditMessage={handleEditMessage}
      />
      <DemoOrchestrator
        chatStatus={status}
        messageCount={messages.length}
        onSendMessage={handleSend}
      />
      {limitBanner}
      <ChatInput
        onSend={handleSend}
        onStop={stop}
        disabled={isAtLimit}
        isLoading={status === 'submitted' || status === 'streaming'}
        placeholder={isAtLimit ? t('demoLimitReached') : t('typeMessage')}
        initialText={editText}
      />
    </div>
  )
}

export default ChatWidget
