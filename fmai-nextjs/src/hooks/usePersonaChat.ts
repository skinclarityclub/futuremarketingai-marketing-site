'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useMemo, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useChatbotStore } from '@/stores/chatbotStore'
import type { MemoryProfile } from '@/lib/chatbot/memory'
import { limitState } from '@/lib/chatbot/message-limit'

const FLAGSHIP_PERSONA_ID = 'flagship'

export function usePersonaChat(personaId: string, pageContext?: { pathname: string }) {
  const { sessionId, messageCounts, incrementMessageCount, demoMode } = useChatbotStore()
  const memoryProfile = useChatbotStore((s) => s.memoryProfile)
  const locale = useLocale()

  // Latest remembered profile, read at request time. Memory hydrates from
  // localStorage after this component mounts; useChat pins the transport built on
  // first render, so a transport-body snapshot would miss the profile on a
  // returning visitor's first message. A ref injected via prepareSendMessagesRequest
  // is always current, so recall works from the very first turn.
  const memoryRef = useRef<MemoryProfile>(memoryProfile)
  useEffect(() => {
    memoryRef.current = memoryProfile
  }, [memoryProfile])

  const messageCount = messageCounts[personaId] || 0

  // Memoize transport to prevent re-creation on every render. React 19
  // compiler infers a broader `pageContext` dependency, but we deliberately
  // narrow to `pageContext?.pathname` because only the pathname affects the
  // chatbot request body; reconstructing transport for unrelated pageContext
  // mutations would tear active streams. Memory is intentionally NOT a dep: it is
  // injected per-request from memoryRef so the transport stays stable.
  /* eslint-disable react-hooks/preserve-manual-memoization, react-hooks/exhaustive-deps -- intentional narrow dep set; see comment above */
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chatbot',
        body: {
          personaId,
          sessionId,
          context: {
            language: locale,
            ...(pageContext ? { currentPage: pageContext.pathname } : {}),
            ...(demoMode ? { demoMode: true } : {}),
          },
        },
        // Inject the remembered profile at REQUEST time from the ref so it is
        // present even on the first message after a cross-session hydration.
        prepareSendMessagesRequest: (options) => {
          const mem = memoryRef.current
          const hasMemory = !!mem && Object.keys(mem).length > 0
          const baseContext = (options.body?.context as Record<string, unknown>) ?? {}
          return {
            body: {
              ...options.body,
              id: options.id,
              messages: options.messages,
              trigger: options.trigger,
              messageId: options.messageId,
              context: {
                ...baseContext,
                ...(hasMemory ? { memoryProfile: mem } : {}),
              },
            },
          }
        },
      }),
    [personaId, sessionId, pageContext?.pathname, demoMode, locale]
  )
  /* eslint-enable react-hooks/preserve-manual-memoization, react-hooks/exhaustive-deps */

  const chat = useChat({
    id: `chat-${personaId}`,
    transport,
    // The SDK also calls onFinish on error; a failed attempt is not a reply. An abort still counts.
    onFinish: ({ isError }) => {
      if (!isError) incrementMessageCount(personaId)
    },
    onError: (error) => {
      console.error(`[chat-${personaId}] error:`, error)
    },
  })

  // The flagship has no limit: count 0 keeps warn and atLimit false.
  const limit = limitState(personaId === FLAGSHIP_PERSONA_ID ? 0 : messageCount)

  return { ...chat, messageCount, limit, isAtLimit: limit.atLimit }
}
