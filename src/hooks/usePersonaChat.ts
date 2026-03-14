import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useChatbotStore } from '../stores/chatbotStore'

const DEMO_MESSAGE_LIMIT = 15
const FLAGSHIP_PERSONA_ID = 'flagship'

export function usePersonaChat(personaId: string, pageContext?: { pathname: string }) {
  const { sessionId, messageCounts, incrementMessageCount } = useChatbotStore()

  const messageCount = messageCounts[personaId] || 0

  const chat = useChat({
    id: `chat-${personaId}`,
    transport: new DefaultChatTransport({
      api: '/api/chatbot',
      body: {
        personaId,
        sessionId,
        context: pageContext ? { currentPage: pageContext.pathname } : undefined,
      },
    }),
    onFinish: () => {
      incrementMessageCount(personaId)
    },
    onError: (error) => {
      console.error(`[chat-${personaId}]`, error)
    },
  })

  return {
    ...chat,
    messageCount,
    isAtLimit: personaId === FLAGSHIP_PERSONA_ID ? false : messageCount >= DEMO_MESSAGE_LIMIT,
  }
}
