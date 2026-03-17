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

  // Journey tracking
  visitedPages: string[]
  toolsUsed: string[]

  // Demo mode (ephemeral, not persisted)
  demoMode: boolean
  demoScenarioId: string | null
  demoStepIndex: number
  demoStatus: 'idle' | 'choosing' | 'running' | 'awaiting-continue' | 'checkpoint' | 'completed'
  demoStartedAt: number | null

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
  addVisitedPage: (page: string) => void
  addToolUsed: (tool: string) => void
  startDemo: () => void
  selectScenario: (id: string) => void
  advanceStep: () => void
  setDemoStatus: (status: ChatbotState['demoStatus']) => void
  endDemo: () => void
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
      visitedPages: [],
      toolsUsed: [],
      demoMode: false,
      demoScenarioId: null,
      demoStepIndex: 0,
      demoStatus: 'idle',
      demoStartedAt: null,

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
      addVisitedPage: (page: string) =>
        set((state) => {
          if (state.visitedPages.includes(page)) {
            return state
          }
          return { visitedPages: [...state.visitedPages, page] }
        }),
      addToolUsed: (tool: string) =>
        set((state) => {
          if (state.toolsUsed.includes(tool)) {
            return state
          }
          return { toolsUsed: [...state.toolsUsed, tool] }
        }),
      startDemo: () =>
        set({
          demoMode: true,
          demoScenarioId: null,
          demoStepIndex: 0,
          demoStatus: 'choosing',
          demoStartedAt: null,
          isOpen: true,
          isMinimized: false,
          // Close side panel to clear any previous tool results
          isSidePanelOpen: false,
          sidePanelContent: null,
        }),
      selectScenario: (id: string) =>
        set({
          demoScenarioId: id,
          demoStepIndex: 0,
          demoStatus: 'running',
          demoStartedAt: Date.now(),
          // Close side panel from previous scenario (e.g. Calendly)
          isSidePanelOpen: false,
          sidePanelContent: null,
        }),
      advanceStep: () =>
        set((state) => ({
          demoStepIndex: state.demoStepIndex + 1,
          demoStatus: 'running' as const,
        })),
      setDemoStatus: (status) => set({ demoStatus: status }),
      endDemo: () =>
        set({
          demoMode: false,
          demoScenarioId: null,
          demoStepIndex: 0,
          demoStatus: 'idle',
          demoStartedAt: null,
        }),
    }),
    {
      name: 'fmai-chatbot-state',
      partialize: (state) => ({
        sessionId: state.sessionId,
        messageCounts: state.messageCounts,
        activePersonaId: state.activePersonaId,
        visitedPages: state.visitedPages,
        toolsUsed: state.toolsUsed,
      }),
    }
  )
)

/** Standalone selector for reading a specific persona's message count */
export const getMessageCount = (personaId: string): number =>
  useChatbotStore.getState().messageCounts[personaId] || 0
