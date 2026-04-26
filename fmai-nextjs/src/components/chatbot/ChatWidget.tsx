'use client'

import { useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { usePersonaChat } from '@/hooks/usePersonaChat'
import { useChatbotStore } from '@/stores/chatbotStore'
import { FloatingButton } from './FloatingButton'
import { ChatHeader } from './ChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { SuggestedPrompts } from './SuggestedPrompts'
import { SidePanel } from './SidePanel'
import { DemoOrchestrator } from './demo/DemoOrchestrator'
import { DemoProgress } from './demo/DemoProgress'
import { DEMO_SCENARIOS } from './demo/scenarios'

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
}: ChatWidgetProps) {
  const t = useTranslations('chat.widget')
  const { messages, sendMessage, status, messageCount, isAtLimit } = usePersonaChat(
    personaId,
    pageContext
  )
  const { isOpen, isMinimized, hasUnread, toggle, close, minimize, markRead } = useChatbotStore()
  const isSidePanelOpen = useChatbotStore((s) => s.isSidePanelOpen)
  const sidePanelContent = useChatbotStore((s) => s.sidePanelContent)
  const closeSidePanel = useChatbotStore((s) => s.closeSidePanel)
  const demoMode = useChatbotStore((s) => s.demoMode)
  const demoScenarioId = useChatbotStore((s) => s.demoScenarioId)
  const demoStepIndex = useChatbotStore((s) => s.demoStepIndex)
  const startDemo = useChatbotStore((s) => s.startDemo)

  const isFlagship = personaId === 'clyde' || personaId === 'flagship'
  const demoScenario = DEMO_SCENARIOS.find((s) => s.id === demoScenarioId)

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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed z-[60] right-6 bottom-24 lg:right-6 lg:top-[80px] lg:bottom-6 flex max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-104px)] overflow-hidden rounded-2xl border border-border-primary shadow-2xl shadow-black/40 bg-bg-surface/95 backdrop-blur-md"
              role="dialog"
              aria-label={`Chat with ${personaName || 'assistant'}`}
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
                />
                <DemoOrchestrator
                  chatStatus={status}
                  messageCount={messages.length}
                  onSendMessage={handleSend}
                />
                {showPrompts && (
                  <SuggestedPrompts
                    prompts={suggestedPrompts}
                    onSelect={handlePromptSelect}
                    disabled={isAtLimit}
                  />
                )}
                {limitBanner}
                <ChatInput
                  onSend={handleSend}
                  disabled={isAtLimit}
                  placeholder={isAtLimit ? t('demoLimitReached') : t('typeMessage')}
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
      />
      <DemoOrchestrator
        chatStatus={status}
        messageCount={messages.length}
        onSendMessage={handleSend}
      />
      {showPrompts && (
        <SuggestedPrompts
          prompts={suggestedPrompts}
          onSelect={handlePromptSelect}
          disabled={isAtLimit}
        />
      )}
      {limitBanner}
      <ChatInput
        onSend={handleSend}
        disabled={isAtLimit}
        placeholder={isAtLimit ? t('demoLimitReached') : t('typeMessage')}
      />
    </div>
  )
}

export default ChatWidget
