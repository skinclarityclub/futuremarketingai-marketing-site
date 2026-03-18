'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useChatbotStore } from '@/stores/chatbotStore'

/**
 * StoreProvider -- Delayed rehydration for Zustand persist stores.
 *
 * Calls rehydrate() in useEffect after initial render to prevent
 * SSR hydration mismatches. The store uses skipHydration: true,
 * so persist data is only loaded client-side.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    useChatbotStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
