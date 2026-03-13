import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

interface ChatbotState {
  // Active persona
  activePersonaId: string

  // UI state (floating mode)
  isOpen: boolean
  isMinimized: boolean
  hasUnread: boolean

  // Session
  sessionId: string
  messageCount: number

  // Actions
  setActivePersona: (id: string) => void
  open: () => void
  close: () => void
  minimize: () => void
  toggle: () => void
  markRead: () => void
  setUnread: () => void
  incrementMessageCount: () => void
  resetSession: () => void
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      // Defaults
      activePersonaId: 'concierge',
      isOpen: false,
      isMinimized: false,
      hasUnread: false,
      sessionId: generateSessionId(),
      messageCount: 0,

      // Actions
      setActivePersona: (id: string) => set({ activePersonaId: id }),
      open: () => set({ isOpen: true, isMinimized: false }),
      close: () => set({ isOpen: false, isMinimized: false }),
      minimize: () => set({ isMinimized: true }),
      toggle: () =>
        set((state) => {
          if (state.isMinimized) {
            return { isMinimized: false }
          }
          return { isOpen: !state.isOpen }
        }),
      markRead: () => set({ hasUnread: false }),
      setUnread: () => set({ hasUnread: true }),
      incrementMessageCount: () => set((state) => ({ messageCount: state.messageCount + 1 })),
      resetSession: () =>
        set({
          sessionId: generateSessionId(),
          messageCount: 0,
        }),
    }),
    {
      name: 'fmai-chatbot-state',
      partialize: (state) => ({
        sessionId: state.sessionId,
        messageCount: state.messageCount,
        activePersonaId: state.activePersonaId,
      }),
    }
  )
)
