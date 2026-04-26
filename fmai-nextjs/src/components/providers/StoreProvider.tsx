'use client'

import type { ReactNode } from 'react'

/**
 * StoreProvider -- thin pass-through. Zustand persist stores rehydrate
 * lazily.
 *
 * Previously this called useChatbotStore.persist.rehydrate() in a
 * useEffect on every page load, paying the localStorage round-trip
 * even for the 95% of visitors who never open the chat.
 *
 * Rehydration now happens inside FloatingChatTrigger.handleOpen on
 * the first user click. See 13-01-PLAN.md Task 5 + RESEARCH R-5.
 *
 * The wrapper itself is kept (instead of deleted) so Providers.tsx
 * does not need to change and so future provider work has a place
 * to land without re-introducing a layer.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
