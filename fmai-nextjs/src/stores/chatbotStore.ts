'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export type DemoStatus = 'choosing' | 'running' | 'awaiting-continue' | 'checkpoint' | 'completed'

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
  /** Demo orchestration status */
  demoStatus: DemoStatus
  /** Timestamp when demo started */
  demoStartedAt: number | null
  /** Side panel open state */
  isSidePanelOpen: boolean
  /** Side panel content */
  sidePanelContent: { toolName: string; data: unknown } | null
  /** Calendly modal open state */
  calendlyOpen: boolean
  /** Calendly prefill data */
  calendlyPrefill: { name?: string; email?: string } | undefined

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
  selectScenario: (id: string) => void
  advanceStep: () => void
  setDemoStatus: (status: DemoStatus) => void
  endDemo: () => void
  openSidePanel: (toolName: string, data: unknown) => void
  closeSidePanel: () => void
  openCalendly: (prefill?: { name?: string; email?: string }) => void
  closeCalendly: () => void
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
      demoStatus: 'choosing' as DemoStatus,
      demoStartedAt: null,
      isSidePanelOpen: false,
      sidePanelContent: null,
      calendlyOpen: false,
      calendlyPrefill: undefined,

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
          demoScenarioId: null,
          demoStepIndex: 0,
          demoStatus: 'choosing' as DemoStatus,
          demoStartedAt: Date.now(),
        }),
      resetDemo: () =>
        set({
          demoMode: false,
          demoScenarioId: null,
          demoStepIndex: 0,
          demoStatus: 'choosing' as DemoStatus,
          demoStartedAt: null,
        }),
      selectScenario: (id: string) =>
        set({
          demoScenarioId: id,
          demoStepIndex: 0,
          demoStatus: 'running' as DemoStatus,
          demoStartedAt: Date.now(),
        }),
      advanceStep: () =>
        set((state) => ({
          demoStepIndex: state.demoStepIndex + 1,
          demoStatus: 'running' as DemoStatus,
        })),
      setDemoStatus: (status: DemoStatus) => set({ demoStatus: status }),
      endDemo: () =>
        set({
          demoMode: false,
          demoScenarioId: null,
          demoStepIndex: 0,
          demoStatus: 'choosing' as DemoStatus,
          demoStartedAt: null,
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
      openCalendly: (prefill?: { name?: string; email?: string }) =>
        set({
          calendlyOpen: true,
          calendlyPrefill: prefill,
        }),
      closeCalendly: () =>
        set({
          calendlyOpen: false,
          calendlyPrefill: undefined,
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
