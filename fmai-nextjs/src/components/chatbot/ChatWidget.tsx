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
import { MemoryChip } from './MemorySheet'
import { useChatChrome } from './useChatChrome'
import { classifyChatError } from '@/lib/chatbot/chat-error'
import { DemoOrchestrator } from './demo/DemoOrchestrator'
import { DemoProgress } from './demo/DemoProgress'
import { getDemoScenarios } from './demo/scenarios'

// One definition: below lg the panel is the whole screen and modal.
const PHONE_QUERY = '(max-width: 1023px)'

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
    error,
    messageCount,
    isAtLimit,
    limit,
    stop,
    regenerate,
    setMessages,
  } = usePersonaChat(personaId, pageContext)
  const chrome = useChatChrome()
  const [editText, setEditText] = useState<string | undefined>(undefined)
  const { isOpen, hasUnread, toggle, close, markRead } = useChatbotStore()
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
      handleSend(text)
    },
    [handleSend]
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
    resetMessageCount(personaId)
    // Keep the persistent memory profile: only "Wis geheugen" clears it (Task 7).
    hasGreeted.current = false
    hasSentFollowup.current = false
  }, [stop, setMessages, resetMessageCount, personaId])

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
    if (
      mode !== 'floating' ||
      !isFlagship ||
      !isOpen ||
      messages.length > 0 ||
      hasGreeted.current ||
      !welcomeMessage ||
      demoMode
    )
      return
    const timer = setTimeout(() => {
      hasGreeted.current = true
      setMessages?.([
        {
          id: 'clyde-welcome',
          role: 'assistant',
          content: welcomeMessage,
          parts: [{ type: 'text', text: welcomeMessage }],
        } as UIMessage,
      ])
    }, 400)
    return () => clearTimeout(timer)
  }, [isOpen, messages.length, welcomeMessage, setMessages, mode, isFlagship, demoMode])

  // Proactive follow-up: Clyde sends a message after 2 min of silence in active chat
  const hasSentFollowup = useRef(false)
  useEffect(() => {
    if (!proactiveFollowupMessage || !isOpen || messages.length === 0 || hasSentFollowup.current)
      return
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

  // Below lg the panel covers the whole screen, so the page behind it must not
  // scroll along with a swipe in the chat. Desktop keeps the page scrollable
  // next to the card.
  const [isPhone, setIsPhone] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY)
    const sync = () => setIsPhone(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // aria-modal only holds when the page behind is really inert, so the same
  // effect makes header, #main and footer inert. The cookie banner stays
  // interactive: it sits above the phone panel (z-9999).
  useEffect(() => {
    if (mode !== 'floating' || !isOpen) return
    if (!window.matchMedia(PHONE_QUERY).matches) return
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const page = document.querySelectorAll<HTMLElement>('header, #main, footer')
    page.forEach((el) => el.setAttribute('inert', ''))
    return () => {
      document.documentElement.style.overflow = previous
      page.forEach((el) => el.removeAttribute('inert'))
    }
  }, [mode, isOpen, isPhone])

  // Below lg the panel is modal (aria-modal), so Tab must not leave it.
  const handlePanelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Tab' || !isPhone) return
      const items = Array.from(
        e.currentTarget.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.tabIndex >= 0 && el.offsetParent !== null)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !e.currentTarget.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !e.currentTarget.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    },
    [isPhone]
  )

  // Only the visitor's own close (Escape, X) hands focus back to the launcher. A
  // route change also closes the chat (island), and there focus must stay on the new page.
  const closeAndRestoreFocus = useCallback(() => {
    close()
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>('[data-clyde-launcher]')?.focus()
    )
  }, [close])

  useEffect(() => {
    if (mode !== 'floating' || !isOpen) return
    const timer = setTimeout(() => {
      const textarea = document.querySelector<HTMLTextAreaElement>(
        '[data-chatwidget-panel] textarea'
      )
      textarea?.focus()
    }, 300)
    return () => clearTimeout(timer)
  }, [mode, isOpen])

  useEffect(() => {
    if (mode !== 'floating' || !isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      // Desktop is non-modal: Escape elsewhere on the page is not ours.
      const panel = document.querySelector('[data-chatwidget-panel]')
      if (!isPhone && !panel?.contains(document.activeElement)) return
      closeAndRestoreFocus()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mode, isOpen, isPhone, closeAndRestoreFocus])

  // The composer (or, once it is disabled, the apply link) keeps focus inside the
  // modal when the element that had it disappears: Opnieuw clicked, limit reached.
  const focusComposer = useCallback(() => {
    requestAnimationFrame(() => {
      const panel = document.querySelector('[data-chatwidget-panel]')
      const target =
        panel?.querySelector<HTMLElement>('textarea:not([disabled])') ??
        panel?.querySelector<HTMLElement>('[data-chat-apply]')
      target?.focus()
    })
  }, [])

  useEffect(() => {
    if (mode !== 'floating' || !isOpen || !isAtLimit) return
    // Only when focus was dropped (body) or is stuck on the now-disabled composer.
    const active = document.activeElement
    if (active === document.body || active?.tagName === 'TEXTAREA') focusComposer()
  }, [mode, isOpen, isAtLimit, focusComposer])

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

  // The limit and error states speak in the footer and under the question, not in banners.
  const applyLink = (
    <Link href="/apply" data-chat-apply className="font-medium text-accent-system hover:underline">
      {chrome.applyCta}
    </Link>
  )
  const footer = limit.atLimit ? (
    <>
      {chrome.limitReached} {chrome.keepTalking} {applyLink}
    </>
  ) : limit.warn ? (
    <>
      <span className="text-accent-human">{chrome.limitWarning(limit.remaining)}</span>{' '}
      <span className="text-text-faint">{chrome.keepTalking}</span> {applyLink}
    </>
  ) : undefined
  const failure = classifyChatError(error)
  const inputPlaceholder = isAtLimit ? chrome.limitReached : t('typeMessage')

  if (mode === 'floating') {
    return (
      <>
        <FloatingButton onClick={toggle} hasUnread={hasUnread} isOpen={isOpen} />
        <AnimatePresence>
          {isOpen && (
            <motion.div
              data-chatwidget-panel
              onKeyDown={handlePanelKeyDown}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              style={{
                boxShadow:
                  '0 24px 60px -12px rgba(0, 0, 0, 0.6), 0 8px 24px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                transformOrigin: 'bottom right',
              }}
              // Phone/tablet: the panel IS the screen (100dvh, no float, no blur:
              // a floating 85%-card left the page peeking through above and below
              // and shrank further under the keyboard). Desktop: a bottom-right
              // card capped at 720px, so a fresh chat is a compact card instead of
              // a column with 600px of nothing under the greeting.
              className="fixed z-[60] inset-0 flex h-[100dvh] w-full overflow-hidden bg-bg-surface lg:inset-auto lg:right-6 lg:bottom-6 lg:h-[min(720px,calc(100dvh-6rem))] lg:w-auto lg:rounded-2xl lg:border lg:border-white/[0.08] lg:bg-bg-surface/85 lg:backdrop-blur-2xl"
              role="dialog"
              aria-label={`Chat met ${personaName || 'Clyde'}`}
              aria-modal={isPhone ? 'true' : undefined}
            >
              <div className="flex h-full w-full min-w-0 flex-col lg:w-[420px]">
                <ChatHeader
                  personaName={personaName || 'Assistant'}
                  personaAvatar={personaAvatar}
                  mode="floating"
                  messageCount={messageCount}
                  messageLimit={messageLimit}
                  onClose={closeAndRestoreFocus}
                  onNewChat={handleNewChat}
                  hasMessages={messages.length > 0}
                  badge={demoMode ? 'Demo' : undefined}
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
                  failure={failure}
                  onRetry={
                    regenerate
                      ? () => {
                          regenerate()
                          focusComposer()
                        }
                      : undefined
                  }
                  onEditMessage={handleEditMessage}
                  inlinePrompts={showInlinePrompts ? suggestedPrompts : undefined}
                  onInlinePromptSelect={handlePromptSelect}
                />
                <DemoOrchestrator
                  chatStatus={status}
                  messageCount={messages.length}
                  onSendMessage={handleSend}
                />
                <ChatInput
                  onSend={handleSend}
                  onStop={stop}
                  disabled={isAtLimit}
                  isLoading={status === 'submitted' || status === 'streaming'}
                  placeholder={inputPlaceholder}
                  footer={footer}
                  footerEnd={isFlagship ? <MemoryChip /> : undefined}
                  footerEnd={isFlagship ? <MemoryChip /> : undefined}
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
        failure={failure}
        onRetry={regenerate ? () => regenerate() : undefined}
        onEditMessage={handleEditMessage}
      />
      <DemoOrchestrator
        chatStatus={status}
        messageCount={messages.length}
        onSendMessage={handleSend}
      />
      <ChatInput
        onSend={handleSend}
        onStop={stop}
        disabled={isAtLimit}
        isLoading={status === 'submitted' || status === 'streaming'}
        placeholder={inputPlaceholder}
        footer={footer}
        initialText={editText}
      />
    </div>
  )
}

export default ChatWidget
