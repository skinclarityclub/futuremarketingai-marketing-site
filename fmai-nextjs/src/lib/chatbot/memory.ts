/**
 * Within-session memory profile for Clyde. Holds the salient facts a prospect
 * reveals about their agency so Clyde can show them in the memory panel and refer
 * back to them. Pure + framework-free so it is unit-testable and importable on both
 * client and server. The zustand store does not persist this (see chatbotStore
 * partialize); cross-session persistence is handled separately and consent-gated in
 * memory-persistence.ts, so a returning visitor with cookie consent is rehydrated.
 */
export interface MemoryProfile {
  agencyName?: string
  niche?: string
  brandCount?: number
  teamSize?: number
  painPoint?: string
  goal?: string
}

/**
 * Merge newly-captured fields into an existing profile. Last write wins per field;
 * undefined/null and blank strings are ignored so a capture that omits a field never
 * erases what we already know. Returns a new object (does not mutate `prev`).
 */
export function mergeMemory(prev: MemoryProfile, next: Partial<MemoryProfile>): MemoryProfile {
  const out: MemoryProfile = { ...prev }
  for (const [key, value] of Object.entries(next)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'string' && value.trim() === '') continue
    ;(out as Record<string, unknown>)[key] = value
  }
  return out
}

/** Field render order + i18n label keys for the memory card. */
export const MEMORY_FIELD_ORDER: (keyof MemoryProfile)[] = [
  'agencyName',
  'niche',
  'brandCount',
  'teamSize',
  'painPoint',
  'goal',
]
