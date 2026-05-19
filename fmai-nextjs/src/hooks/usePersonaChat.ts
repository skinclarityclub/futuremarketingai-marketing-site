'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useMemo } from 'react'
import { useChatbotStore } from '@/stores/chatbotStore'

const DEMO_MESSAGE_LIMIT = 15
const FLAGSHIP_PERSONA_ID = 'flagship'

export function usePersonaChat(personaId: string, pageContext?: { pathname: string }) {
  const { sessionId, messageCounts, incrementMessageCount, demoMode } = useChatbotStore()

  const messageCount = messageCounts[personaId] || 0

  // Memoize transport to prevent re-creation on every render. React 19
  // compiler infers a broader `pageContext` dependency, but we deliberately
  // narrow to `pageContext?.pathname` because only the pathname affects the
  // chatbot request body; reconstructing transport for unrelated pageContext
  // mutations would tear active streams.
  /* eslint-disable react-hooks/preserve-manual-memoization, react-hooks/exhaustive-deps -- intentional narrow dep set; see comment above */
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chatbot',
        body: {
          personaId,
          sessionId,
          context: pageContext
            ? { currentPage: pageContext.pathname, demoMode: demoMode || undefined }
            : demoMode
              ? { demoMode: true }
              : undefined,
        },
      }),
    [personaId, sessionId, pageContext?.pathname, demoMode]
  )
  /* eslint-enable react-hooks/preserve-manual-memoization, react-hooks/exhaustive-deps */

  const chat = useChat({
    id: `chat-${personaId}`,
    transport,
    onFinish: () => {
      incrementMessageCount(personaId)
    },
    onError: (error) => {
      console.error(`[chat-${personaId}] error:`, error)
    },
  })

  return {
    ...chat,
    messageCount,
    isAtLimit: personaId === FLAGSHIP_PERSONA_ID ? false : messageCount >= DEMO_MESSAGE_LIMIT,
  }
}
