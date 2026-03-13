import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useChatbotStore } from '../stores/chatbotStore'

const DEMO_MESSAGE_LIMIT = 15

export function usePersonaChat(personaId: string) {
  const { sessionId, messageCount, incrementMessageCount } = useChatbotStore()

  const chat = useChat({
    id: `chat-${personaId}`,
    transport: new DefaultChatTransport({
      api: '/api/chatbot',
      body: {
        personaId,
        sessionId,
      },
    }),
    onFinish: () => {
      incrementMessageCount()
    },
    onError: (error) => {
      console.error(`[chat-${personaId}]`, error)
    },
  })

  return {
    ...chat,
    messageCount,
    isAtLimit: messageCount >= DEMO_MESSAGE_LIMIT,
  }
}
