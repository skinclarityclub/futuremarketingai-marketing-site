'use client'

import type { ReactNode } from 'react'
import { StoreProvider } from './StoreProvider'

/**
 * Providers -- Composable provider wrapper for the locale layout.
 *
 * Wraps children in all required client-side providers.
 * Designed for easy extension (analytics, feature flags, etc.).
 */
export function Providers({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>
}
