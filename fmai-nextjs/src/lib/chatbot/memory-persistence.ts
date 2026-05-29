/**
 * Cross-session persistence for Clyde's within-session MemoryProfile. Stores the
 * profile in a dedicated, consent-gated localStorage entry (`clyde:memory`) that is
 * separate from the zustand store-persist so it can be wiped precisely and is only
 * written once cookie consent exists. Pure parse/serialize so it is unit-testable;
 * the storage helpers are no-ops on the server and in private/no-consent mode.
 */
import { MEMORY_FIELD_ORDER, type MemoryProfile } from './memory'

export const MEMORY_STORAGE_KEY = 'clyde:memory'
const MEMORY_VERSION = 1

/** Serialize a profile to a versioned JSON payload. */
export function serializeMemory(profile: MemoryProfile): string {
  return JSON.stringify({ v: MEMORY_VERSION, profile })
}

/** Parse a stored payload back to a profile. Returns {} for null/garbage/version
 *  mismatch, and keeps only known fields (no prototype pollution / schema drift). */
export function parseMemory(raw: string | null): MemoryProfile {
  if (!raw) return {}
  try {
    const data = JSON.parse(raw) as { v?: number; profile?: Record<string, unknown> }
    if (data?.v !== MEMORY_VERSION || !data.profile) return {}
    const out: MemoryProfile = {}
    for (const key of MEMORY_FIELD_ORDER) {
      const v = data.profile[key]
      if (v !== undefined && v !== null) (out as Record<string, unknown>)[key] = v
    }
    return out
  } catch {
    return {}
  }
}

/** True when the visitor has interacted with the cookie banner (functional is
 *  always-on once consent exists). We only persist memory after that. */
export function hasMemoryConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem('cookieConsent') !== null
  } catch {
    return false
  }
}

/** Load the persisted profile (consent-gated, storage-safe). */
export function loadMemory(): MemoryProfile {
  if (typeof window === 'undefined' || !hasMemoryConsent()) return {}
  try {
    return parseMemory(window.localStorage.getItem(MEMORY_STORAGE_KEY))
  } catch {
    return {}
  }
}

/** Persist the profile (consent-gated, storage-safe). No-op without consent. */
export function saveMemory(profile: MemoryProfile): void {
  if (typeof window === 'undefined' || !hasMemoryConsent()) return
  try {
    window.localStorage.setItem(MEMORY_STORAGE_KEY, serializeMemory(profile))
  } catch {
    /* quota / private mode: silently skip */
  }
}

/** Remove the persisted profile. */
export function clearMemory(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(MEMORY_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
