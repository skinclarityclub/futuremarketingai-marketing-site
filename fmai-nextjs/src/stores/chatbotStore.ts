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
  /** Whether the chatbot panel is minimized */
  isMinimized: boolean
  /** Whether there are unread messages */
  hasUnread: boolean
  /** Session identifier (UUID) */
  sessionId: string
  /** Message counts per persona */
  messageCounts: Record<string, number>
  /** Demo mode toggle */
  demoMode: boolean
  /** Active demo scenario ID */
  demoScenarioId: string | null
  /** Current demo step index */
  demoStepIndex: number
  /** Side panel open state */
  isSidePanelOpen: boolean
  /** Side panel content */
  sidePanelContent: { toolName: string; data: unknown } | null

  // Actions
  setPersona: (id: string) => void
  toggle: () => void
  close: () => void
  minimize: () => void
  markRead: () => void
  incrementMessageCount: (personaId: string) => void
  setDemoMode: (enabled: boolean) => void
  startDemo: () => void
  resetDemo: () => void
  openSidePanel: (toolName: string, data: unknown) => void
  closeSidePanel: () => void
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      // Defaults
      personaId: 'concierge',
      isOpen: false,
      isMinimized: false,
      hasUnread: false,
      sessionId: generateSessionId(),
      messageCounts: {},
      demoMode: false,
      demoScenarioId: null,
      demoStepIndex: 0,
      isSidePanelOpen: false,
      sidePanelContent: null,

      // Actions
      setPersona: (id: string) => set({ personaId: id }),
      toggle: () =>
        set((state) => ({
          isOpen: !state.isOpen,
          isMinimized: false,
        })),
      close: () => set({ isOpen: false, isMinimized: false }),
      minimize: () => set({ isMinimized: true }),
      markRead: () => set({ hasUnread: false }),
      incrementMessageCount: (personaId: string) =>
        set((state) => ({
          messageCounts: {
            ...state.messageCounts,
            [personaId]: (state.messageCounts[personaId] || 0) + 1,
          },
        })),
      setDemoMode: (enabled: boolean) => set({ demoMode: enabled }),
      startDemo: () =>
        set({
          demoMode: true,
          demoScenarioId: 'flagship-tour',
          demoStepIndex: 0,
        }),
      resetDemo: () =>
        set({
          demoMode: false,
          demoScenarioId: null,
          demoStepIndex: 0,
        }),
      openSidePanel: (toolName: string, data: unknown) =>
        set({
          isSidePanelOpen: true,
          sidePanelContent: { toolName, data },
        }),
      closeSidePanel: () =>
        set({
          isSidePanelOpen: false,
          sidePanelContent: null,
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
