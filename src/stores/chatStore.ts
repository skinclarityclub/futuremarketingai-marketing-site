/**
 * Chat Store - AI Journey Assistant
 *
 * Manages conversation state, message history, and UI state
 * for the AI Journey Assistant chat interface.
 *
 * @module chatStore
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, CardData, QuickRepliesMessage } from '../types/chat'

/**
 * Chat State Interface
 */
interface ChatState {
  // ===== UI State =====
  isOpen: boolean
  isMinimized: boolean
  hasUnreadMessages: boolean

  // ===== Conversation State =====
  messages: ChatMessage[]
  currentQuestion: string
  isTyping: boolean
  typingActivity: 'thinking' | 'searching' | 'generating' | null

  // ===== Actions =====
  openChat: () => void
  closeChat: () => void
  minimizeChat: () => void
  toggleChat: () => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  addSystemMessage: (content: string, suggestedActions?: string[]) => void
  addUserMessage: (content: string) => void
  addCardMessage: (content: string, card: CardData) => void
  addCarouselMessage: (content: string, cards: CardData[]) => void
  addQuickRepliesMessage: (content: string, replies: QuickRepliesMessage['replies']) => void
  addAchievementMessage: (title: string, description: string, icon: string, points?: number) => void
  addNavigationMessage: (
    content: string,
    navigationData: {
      label: string
      route: string
      icon?: 'calculator' | 'explorer' | 'dashboard' | 'sparkles' | 'demo'
      helpText?: string
      features?: string[]
      ctaText?: string
    }
  ) => void
  addCalendlyBookingMessage: (
    content: string,
    calendlyData?: {
      prefill?: {
        name?: string
        email?: string
        company?: string
        notes?: string
      }
      ctaText?: string
      secondaryCtaText?: string
    }
  ) => void
  clearMessages: () => void
  setTyping: (typing: boolean, activity?: 'thinking' | 'searching' | 'generating') => void
  setCurrentQuestion: (question: string) => void
  setMessageReaction: (messageId: string, reaction: 'helpful' | 'not-helpful' | null) => void
  markAsRead: () => void
  resetChat: () => void
}

/**
 * Generate unique message ID
 */
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Initial chat state
 */
const initialState = {
  isOpen: false,
  isMinimized: false,
  hasUnreadMessages: false,
  messages: [],
  currentQuestion: '',
  isTyping: false,
  typingActivity: null as 'thinking' | 'searching' | 'generating' | null,
}

/**
 * Chat Store
 *
 * Persists conversation history and UI state to localStorage
 * for session continuity.
 *
 * Usage:
 * ```tsx
 * const { isOpen, messages, addMessage, openChat } = useChatStore()
 * ```
 */
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ===== UI Actions =====
      openChat: () => {
        set({ isOpen: true, isMinimized: false, hasUnreadMessages: false })
      },

      closeChat: () => {
        set({ isOpen: false, isMinimized: false })
      },

      minimizeChat: () => {
        set({ isMinimized: true })
      },

      toggleChat: () => {
        const { isOpen } = get()
        if (isOpen) {
          set({ isOpen: false, isMinimized: false })
        } else {
          set({ isOpen: true, isMinimized: false, hasUnreadMessages: false })
        }
      },

      // ===== Message Actions =====
      addMessage: (message: any) => {
        const newMessage = {
          ...message,
          id: generateMessageId(),
          timestamp: Date.now(),
        } as ChatMessage

        set((state) => ({
          messages: [...state.messages, newMessage],
          hasUnreadMessages: !state.isOpen, // Mark unread if chat is closed
        }))
      },

      addSystemMessage: (content, suggestedActions) => {
        get().addMessage({
          type: 'text',
          sender: 'system',
          content,
          suggestedActions,
        } as any)
      },

      addUserMessage: (content) => {
        get().addMessage({
          type: 'text',
          sender: 'user',
          content,
        } as any)
      },

      addCardMessage: (content, card) => {
        get().addMessage({
          type: 'card',
          sender: 'system',
          content,
          card,
        } as any)
      },

      addCarouselMessage: (content, cards) => {
        get().addMessage({
          type: 'carousel',
          sender: 'system',
          content,
          cards,
        } as any)
      },

      addQuickRepliesMessage: (content, replies) => {
        get().addMessage({
          type: 'quick-replies',
          sender: 'system',
          content,
          replies,
        } as any)
      },

      addAchievementMessage: (title, description, icon, points) => {
        get().addMessage({
          type: 'achievement',
          sender: 'system',
          title,
          description,
          icon,
          points,
        } as any)
      },

      addNavigationMessage: (content, navigationData) => {
        get().addMessage({
          type: 'navigation',
          sender: 'system',
          content,
          navigationData,
        } as any)
      },

      addCalendlyBookingMessage: (content, calendlyData) => {
        const message = {
          type: 'demo-invite',
          sender: 'system',
          content,
          calendlyUrl: '', // Not needed - hook handles URL selection
          prefillData: calendlyData?.prefill,
          ctaText: calendlyData?.ctaText || 'Plan demo 📅',
          secondaryCtaText: calendlyData?.secondaryCtaText || 'Nog even kijken',
        }
        get().addMessage(message as any)
      },

      clearMessages: () => {
        set({ messages: [] })
      },

      setTyping: (typing, activity) => {
        set({
          isTyping: typing,
          typingActivity: typing ? activity || 'thinking' : null,
        })
      },

      setCurrentQuestion: (question) => {
        set({ currentQuestion: question })
      },

      setMessageReaction: (messageId, reaction) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? ({ ...msg, reaction } as unknown as ChatMessage) : msg
          ),
        }))
      },

      markAsRead: () => {
        set({ hasUnreadMessages: false })
      },

      resetChat: () => {
        set(initialState)
      },
    }),
    {
      name: 'fmai-chat-state',
      version: 2, // Bumped version for new message types
      // Only persist conversation and unread state, not UI state
      partialize: (state) => ({
        messages: state.messages,
        hasUnreadMessages: state.hasUnreadMessages,
      }),
    }
  )
)

export default useChatStore
