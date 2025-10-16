/**
 * Floating Element Context
 *
 * Coordinates multiple floating UI elements to prevent overwhelming users.
 * Ensures only one high-priority element is active at a time.
 *
 * Priority hierarchy:
 * 1. Modals (e.g., "Ready to Start?") - Highest priority
 * 2. Chat Assistant - Medium priority
 * 3. Banners (e.g., Founding Member) - Always visible, lowest z-index
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type FloatingElementType = 'modal' | 'chat' | null

interface FloatingElementContextValue {
  activeElement: FloatingElementType
  openModal: () => void
  closeModal: () => void
  openChat: () => void
  closeChat: () => void
  canOpenChat: () => boolean
  canOpenModal: () => boolean
}

const FloatingElementContext = createContext<FloatingElementContextValue | undefined>(undefined)

interface FloatingElementProviderProps {
  children: ReactNode
}

export function FloatingElementProvider({ children }: FloatingElementProviderProps) {
  const [activeElement, setActiveElement] = useState<FloatingElementType>(null)

  /**
   * Open modal (and close chat if open)
   */
  const openModal = useCallback(() => {
    setActiveElement('modal')
  }, [])

  /**
   * Close modal
   */
  const closeModal = useCallback(() => {
    setActiveElement(null)
  }, [])

  /**
   * Open chat (and close modal if open)
   */
  const openChat = useCallback(() => {
    // Always set to chat immediately (modal will auto-close)
    setActiveElement('chat')
  }, [])

  /**
   * Close chat
   */
  const closeChat = useCallback(() => {
    setActiveElement(null)
  }, [])

  /**
   * Check if chat can be opened
   */
  const canOpenChat = useCallback(() => {
    // Chat can always be opened (will auto-close modal)
    return true
  }, [])

  /**
   * Check if modal can be opened
   */
  const canOpenModal = useCallback(() => {
    // Modal can always be opened (will auto-close chat)
    return true
  }, [])

  const value: FloatingElementContextValue = {
    activeElement,
    openModal,
    closeModal,
    openChat,
    closeChat,
    canOpenChat,
    canOpenModal,
  }

  return <FloatingElementContext.Provider value={value}>{children}</FloatingElementContext.Provider>
}

/**
 * Hook to use floating element coordination
 */
export function useFloatingElement() {
  const context = useContext(FloatingElementContext)
  if (context === undefined) {
    throw new Error('useFloatingElement must be used within FloatingElementProvider')
  }
  return context
}
