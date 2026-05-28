'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from '@/i18n/navigation'
import { useChatbotStore } from '@/stores/chatbotStore'
import { useIdleEngagement } from '@/hooks/useIdleEngagement'
import { ClydePresence } from './ClydePresence'

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

/**
 * Page-aware whispers shown after 20s of scroll-idle. Tone: senior
 * Dutch colleague making a statement, not a chatbot asking "how can I
 * help?". Mirrors the path keys from ChatWidgetIsland.WELCOME_MESSAGES.
 */
const WHISPERS: Record<string, string> = {
  '/': 'Vraag me wat.',
  '/skills/voice-agent': 'Telefoon? Ik laat het zien.',
  '/skills/social-media': 'Content-kalender nodig?',
  '/skills/lead-qualifier': 'Dit is wat je klanten krijgen.',
  '/skills/ad-creator': 'Brief? Ik maak varianten.',
  '/skills/email-management': 'Inbox-classificatie tonen?',
  '/skills/reporting': 'Een weekrapport laten zien?',
  '/pricing': 'ROI berekenen.',
  '/apply': 'Vraag voor je invult?',
  '/about': 'Vraag maar.',
}

export function FloatingChatTrigger() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const idleStage = useIdleEngagement()
  const hasUnread = useChatbotStore((state) => state.hasUnread)

  const handleOpen = useCallback(() => {
    void useChatbotStore.persist.rehydrate()
    useChatbotStore.setState({ isOpen: true, isMinimized: false })
    setMounted(true)
  }, [])

  if (mounted) return <ChatWidgetIsland />

  const whisper = WHISPERS[pathname] ?? WHISPERS['/']

  return (
    <ClydePresence
      onClick={handleOpen}
      whisper={whisper}
      idleStage={idleStage}
      hasUnread={hasUnread}
    />
  )
}
