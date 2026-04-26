'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useChatbotStore } from '@/stores/chatbotStore'

/**
 * FloatingChatTrigger -- Minimal placeholder button that lazy-imports
 * the full ChatWidget on first user interaction.
 *
 * Why: ChatWidget pulls in motion/react, the AI SDK chat hooks, the
 * demo orchestrator, and ~20 other client modules. 95% of visitors
 * never open the chat. This trigger ships a single ~14-byte rounded
 * button + an inline SVG icon, defers the heavy chunk to the click,
 * and rehydrates the persisted Zustand store at the same moment.
 *
 * After mount, ChatWidget renders its own FloatingButton + panel and
 * takes over. The placeholder unmounts immediately to avoid double
 * buttons stacking. See 13-01-PLAN.md Task 3 + RESEARCH R-2/R-3/R-5.
 */

// Re-uses the existing default export of ChatWidgetIsland which already
// owns the per-pathname welcome message + suggested prompts mapping.
// Keeps that wiring centralised instead of duplicating it here.
const ChatWidgetIsland = dynamic(
  () =>
    import('@/components/chatbot/ChatWidgetIsland').then((m) => ({
      default: m.ChatWidgetIsland,
    })),
  { ssr: false, loading: () => null }
)

export function FloatingChatTrigger() {
  const [mounted, setMounted] = useState(false)

  const handleOpen = useCallback(() => {
    // Rehydrate persisted Zustand state (sessionId, personaId, message
    // counts) on first interaction. Deferred from StoreProvider in
    // Task 5; cheap no-op on subsequent clicks because Zustand persist
    // guards against double rehydrate.
    void useChatbotStore.persist.rehydrate()
    // Open the panel so the user gets a one-click experience: their
    // single click both loads the chunk AND opens the chat. ChatWidget
    // mounts with isOpen === true and renders the panel directly.
    useChatbotStore.setState({ isOpen: true, isMinimized: false })
    setMounted(true)
  }, [])

  if (mounted) return <ChatWidgetIsland />

  return (
    <button
      type="button"
      onClick={handleOpen}
      aria-label="Open chat met Clyde"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent-system text-bg-deep shadow-xl transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
    >
      {/* Inline SVG keeps this trigger free of lucide-react. */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}
