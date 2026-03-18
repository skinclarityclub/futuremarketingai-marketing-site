'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

interface ChatbotState {
  /** Active persona identifier */
  personaId: string
  /** Whether the chatbot panel is open */
  isOpen: boolean
  /** Session identifier (UUID) */
  sessionId: string
  /** Message counts per persona */
  messageCounts: Record<string, number>
  /** Demo mode toggle */
  demoMode: boolean
  /** Active demo scenario ID */
  demoScenario: string | null
  /** Current demo step index */
  demoStep: number

  // Actions
  setPersona: (id: string) => void
  toggleOpen: () => void
  incrementMessageCount: (personaId: string) => void
  setDemoMode: (enabled: boolean) => void
  setDemoScenario: (id: string | null) => void
  setDemoStep: (step: number) => void
  resetDemo: () => void
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      // Defaults
      personaId: 'concierge',
      isOpen: false,
      sessionId: generateSessionId(),
      messageCounts: {},
      demoMode: false,
      demoScenario: null,
      demoStep: 0,

      // Actions
      setPersona: (id: string) => set({ personaId: id }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      incrementMessageCount: (personaId: string) =>
        set((state) => ({
          messageCounts: {
            ...state.messageCounts,
            [personaId]: (state.messageCounts[personaId] || 0) + 1,
          },
        })),
      setDemoMode: (enabled: boolean) => set({ demoMode: enabled }),
      setDemoScenario: (id: string | null) => set({ demoScenario: id }),
      setDemoStep: (step: number) => set({ demoStep: step }),
      resetDemo: () =>
        set({
          demoMode: false,
          demoScenario: null,
          demoStep: 0,
        }),
    }),
    {
      name: 'chatbot-store',
      skipHydration: true,
      partialize: (state) => ({
        sessionId: state.sessionId,
        personaId: state.personaId,
        messageCounts: state.messageCounts,
      }),
    }
  )
)
