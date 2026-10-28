'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { useChatbotStore } from '@/stores/chatbotStore'
import { useIdleEngagement } from '@/hooks/useIdleEngagement'
import { ClydePresence } from './ClydePresence'
import { WHISPERS } from './widget-copy'
import type { ChatLocale } from './useChatChrome'

/**
 * FloatingChatTrigger -- Minimal placeholder that lazy-imports the full
 * ChatWidget on first user interaction.
 *
 * Why: ChatWidget pulls in motion/react, the AI SDK chat hooks, the
 * demo orchestrator, and ~20 other client modules. 95% of visitors
 * never open the chat. This trigger ships only the Clyde presence
 * silhouette + idle-engagement hook, defers the heavy chunk to the
 * click, and rehydrates the persisted Zustand store at the same moment.
 *
 * The visible identity is the obelisk/monolith from ClydePresence --
 * see docs/plans/2026-05-27-clyde-character-brief.md for the rationale.
 */

const ChatWidgetIsland = dynamic(
  () =>
    import('@/components/chatbot/ChatWidgetIsland').then((m) => ({
      default: m.ChatWidgetIsland,
    })),
  { ssr: false, loading: () => null }
)

function canWhisper(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(max-width: 639px)').matches) return false
  try {
    return !sessionStorage.getItem('clyde:whispered')
  } catch {
    return true
  }
}

export function FloatingChatTrigger() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const rawLocale = useLocale()
  const locale: ChatLocale = rawLocale === 'en' || rawLocale === 'es' ? rawLocale : 'nl'
  const idleStage = useIdleEngagement()
  const hasUnread = useChatbotStore((state) => state.hasUnread)

  // One hint per browser session, never on phones. The whisper element is mounted (hidden)
  // from the start so it can transition, hence browser state is read after hydration.
  const [whisperAllowed, setWhisperAllowed] = useState(false)
  useEffect(() => setWhisperAllowed(canWhisper()), [])
  // Once the whisper has shown and folded away it stays away, also across SPA navigation.
  const [prevStage, setPrevStage] = useState(idleStage)
  const [whisperSpent, setWhisperSpent] = useState(false)
  if (idleStage !== prevStage) {
    setPrevStage(idleStage)
    if (prevStage === 'whispering') setWhisperSpent(true)
  }
  const showWhisper = whisperAllowed && !whisperSpent
  useEffect(() => {
    if (idleStage !== 'whispering' || !showWhisper) return
    try {
      sessionStorage.setItem('clyde:whispered', '1')
    } catch {}
  }, [idleStage, showWhisper])

  const handleOpen = useCallback(() => {
    void useChatbotStore.persist.rehydrate()
    useChatbotStore.setState({ isOpen: true })
    setMounted(true)
  }, [])

  if (mounted) return <ChatWidgetIsland />

  const whisper = WHISPERS[locale][pathname] ?? WHISPERS[locale]['/']

  return (
    <ClydePresence
      onClick={handleOpen}
      whisper={showWhisper ? whisper : ''}
      idleStage={idleStage === 'whispering' && !showWhisper ? 'noticed' : idleStage}
      hasUnread={hasUnread}
    />
  )
}
