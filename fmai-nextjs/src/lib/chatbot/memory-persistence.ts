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

/** Fields stored as finite numbers; every other MEMORY_FIELD_ORDER key is a string. */
const NUMERIC_FIELDS = new Set<keyof MemoryProfile>(['brandCount', 'teamSize'])

/** Serialize a profile to a versioned JSON payload. */
export function serializeMemory(profile: MemoryProfile): string {
  return JSON.stringify({ v: MEMORY_VERSION, profile })
}

/** Parse a stored payload back to a profile. Returns {} for null/garbage/version
 *  mismatch. Keeps only known fields (no prototype pollution / schema drift) AND
 *  only when the value matches the field's expected type, so a hand-edited entry
 *  (e.g. brandCount as an object) can never leak a malformed value into the UI or
 *  the system prompt. */
export function parseMemory(raw: string | null): MemoryProfile {
  if (!raw) return {}
  try {
    const data = JSON.parse(raw) as { v?: number; profile?: Record<string, unknown> }
    if (data?.v !== MEMORY_VERSION || !data.profile) return {}
    const out: MemoryProfile = {}
    for (const key of MEMORY_FIELD_ORDER) {
      const v = data.profile[key]
      if (v === undefined || v === null) continue
      if (NUMERIC_FIELDS.has(key)) {
        if (typeof v === 'number' && Number.isFinite(v)) (out as Record<string, unknown>)[key] = v
      } else if (typeof v === 'string') {
        ;(out as Record<string, unknown>)[key] = v
      }
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

/** Persist the profile (consent-gated, storage-safe). No-op without consent.
 *  An empty profile removes the key instead of writing an empty record, so the
 *  persist-on-change effect that fires right after "Wis geheugen" leaves no trace
 *  (clearMemory + saveMemory({}) are idempotent). */
export function saveMemory(profile: MemoryProfile): void {
  if (typeof window === 'undefined' || !hasMemoryConsent()) return
  try {
    if (Object.keys(profile).length === 0) {
      window.localStorage.removeItem(MEMORY_STORAGE_KEY)
      return
    }
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
