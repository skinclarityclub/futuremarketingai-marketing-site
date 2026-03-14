import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

interface SidePanelContent {
  toolName: string
  data: unknown
}

interface ChatbotState {
  // Active persona
  activePersonaId: string

  // UI state (floating mode)
  isOpen: boolean
  isMinimized: boolean
  hasUnread: boolean

  // Side panel (ephemeral, not persisted)
  isSidePanelOpen: boolean
  sidePanelContent: SidePanelContent | null

  // Session
  sessionId: string
  messageCounts: Record<string, number>

  // Actions
  setActivePersona: (id: string) => void
  open: () => void
  close: () => void
  minimize: () => void
  toggle: () => void
  markRead: () => void
  setUnread: () => void
  incrementMessageCount: (personaId: string) => void
  resetSession: () => void
  openSidePanel: (toolName: string, data: unknown) => void
  closeSidePanel: () => void
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      // Defaults
      activePersonaId: 'concierge',
      isOpen: false,
      isMinimized: false,
      hasUnread: false,
      isSidePanelOpen: false,
      sidePanelContent: null,
      sessionId: generateSessionId(),
      messageCounts: {},

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
      incrementMessageCount: (personaId: string) =>
        set((state) => ({
          messageCounts: {
            ...state.messageCounts,
            [personaId]: (state.messageCounts[personaId] || 0) + 1,
          },
        })),
      resetSession: () =>
        set({
          sessionId: generateSessionId(),
          messageCounts: {},
        }),
      openSidePanel: (toolName: string, data: unknown) =>
        set({ isSidePanelOpen: true, sidePanelContent: { toolName, data } }),
      closeSidePanel: () => set({ isSidePanelOpen: false, sidePanelContent: null }),
    }),
    {
      name: 'fmai-chatbot-state',
      partialize: (state) => ({
        sessionId: state.sessionId,
        messageCounts: state.messageCounts,
        activePersonaId: state.activePersonaId,
      }),
    }
  )
)

/** Standalone selector for reading a specific persona's message count */
export const getMessageCount = (personaId: string): number =>
  useChatbotStore.getState().messageCounts[personaId] || 0
