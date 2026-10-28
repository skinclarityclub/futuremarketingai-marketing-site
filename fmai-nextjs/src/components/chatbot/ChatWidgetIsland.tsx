'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { ChatWidget } from './ChatWidget'
import { ProactiveNudge } from './ProactiveNudge'
import { useChatbotStore } from '@/stores/chatbotStore'
import { loadMemory, saveMemory } from '@/lib/chatbot/memory-persistence'
import { welcomeBackMessage } from './welcome-back'
import type { ChatLocale } from './useChatChrome'
import {
  WELCOME_MESSAGES,
  SUGGESTED_PROMPTS,
  PROACTIVE_PROMPTS,
  PROACTIVE_FOLLOWUPS,
} from './widget-copy'

function normalizeLocale(value: string): ChatLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
}

/** After Clyde sends the visitor to a page, he chimes in once this soon. */
const POST_NAV_NUDGE_DELAY_MS = 6_000

export function ChatWidgetIsland() {
  const pathname = usePathname()
  const locale = normalizeLocale(useLocale())
  const isOpen = useChatbotStore((s) => s.isOpen)
  const toggle = useChatbotStore((s) => s.toggle)
  const close = useChatbotStore((s) => s.close)
  const closeSidePanel = useChatbotStore((s) => s.closeSidePanel)
  const sendChatMessage = useChatbotStore((s) => s.sendChatMessage)
  const memoryProfile = useChatbotStore((s) => s.memoryProfile)
  const setMemoryProfile = useChatbotStore((s) => s.setMemoryProfile)

  const [nudgeVisible, setNudgeVisible] = useState(false)
  // Set when a navigation started from an open chat, so Clyde follows up on the
  // destination page instead of going silent.
  const [cameFromChat, setCameFromChat] = useState(false)
  const prevPathname = useRef(pathname)
  // At most one proactive nudge per page visit (post-nav).
  const nudgedThisPage = useRef(false)
  const nudgePrompt = PROACTIVE_PROMPTS[locale][pathname]
  const followupMessage =
    PROACTIVE_FOLLOWUPS[locale][pathname] ?? PROACTIVE_FOLLOWUPS[locale].default
  // Returning visitor with a remembered agency gets a personalized greeting; everyone
  // else falls back to the page-aware welcome.
  const welcomeMessage =
    welcomeBackMessage(locale, memoryProfile) ??
    WELCOME_MESSAGES[locale][pathname] ??
    WELCOME_MESSAGES[locale].default

  // Hydrate persisted memory once on mount (client-only, consent-gated). Lets Clyde
  // recall an agency across sessions; no-op on the server / without cookie consent.
  const hydratedMemory = useRef(false)
  useEffect(() => {
    if (hydratedMemory.current) return
    hydratedMemory.current = true
    const stored = loadMemory()
    if (Object.keys(stored).length > 0) setMemoryProfile(stored)
  }, [setMemoryProfile])

  // Persist memory whenever it changes (no-op without consent / in private mode).
  // Guarded by hydratedMemory so we never overwrite a stored profile with the empty
  // initial state before hydration has run.
  useEffect(() => {
    if (!hydratedMemory.current) return
    saveMemory(memoryProfile)
  }, [memoryProfile])

  // On any route change: close the chat so the visitor can read the new page,
  // and remember whether they came from an open chat so Clyde can follow up.
  useEffect(() => {
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname
    setNudgeVisible(false)
    nudgedThisPage.current = false
    // Clear any open tool side panel so reopening on the new page starts clean.
    closeSidePanel()
    if (isOpen) {
      close()
      setCameFromChat(true)
    } else {
      setCameFromChat(false)
    }
  }, [pathname, isOpen, close, closeSidePanel])

  // Hide nudge when chat opens
  useEffect(() => {
    if (isOpen) setNudgeVisible(false)
  }, [isOpen])

  // Post-navigation follow-up: Clyde sent them here, so chime in once, regardless
  // of prior engagement.
  useEffect(() => {
    if (!cameFromChat) return
    if (!nudgePrompt || isOpen || nudgedThisPage.current) {
      setCameFromChat(false)
      return
    }
    const timer = setTimeout(() => {
      nudgedThisPage.current = true
      setNudgeVisible(true)
      setCameFromChat(false)
    }, POST_NAV_NUDGE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [cameFromChat, nudgePrompt, isOpen])

  const handleNudgeAccept = useCallback(() => {
    setNudgeVisible(false)
    if (!isOpen) toggle()
    if (nudgePrompt) sendChatMessage(nudgePrompt)
  }, [isOpen, toggle, sendChatMessage, nudgePrompt])

  const handleNudgeDismiss = useCallback(() => {
    setNudgeVisible(false)
  }, [])

  // Keyboard shortcut: Ctrl+K / Cmd+K → open chat and focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        const active = document.activeElement
        // Don't hijack if user is typing in an unrelated input
        if (
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          (active instanceof HTMLElement && active.isContentEditable)
        ) {
          return
        }
        e.preventDefault()
        if (!isOpen) {
          toggle()
        } else {
          const textarea = document.querySelector<HTMLTextAreaElement>(
            '[data-chatwidget-panel] textarea'
          )
          textarea?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, toggle])

  return (
    <>
      <ProactiveNudge
        message={nudgePrompt ?? ''}
        visible={nudgeVisible}
        onAccept={handleNudgeAccept}
        onDismiss={handleNudgeDismiss}
      />
      <ChatWidget
        mode="floating"
        personaId="clyde"
        personaName="Clyde"
        pageContext={{ pathname }}
        suggestedPrompts={SUGGESTED_PROMPTS[locale][pathname] ?? SUGGESTED_PROMPTS[locale].default}
        welcomeMessage={welcomeMessage}
        proactiveFollowupMessage={followupMessage}
      />
    </>
  )
}

export default ChatWidgetIsland
