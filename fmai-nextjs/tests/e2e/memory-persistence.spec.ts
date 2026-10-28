import { test, expect } from '@playwright/test'
import {
  serializeMemory,
  parseMemory,
  loadMemory,
  MEMORY_STORAGE_KEY,
} from '../../src/lib/chatbot/memory-persistence'

// Pure-logic spec (no browser, no API). Runs under any project; fast.
test.describe('memory-persistence (pure)', () => {
  test('serialize then parse round-trips a profile', () => {
    const profile = { agencyName: 'Duinrust', niche: 'horeca', brandCount: 6, teamSize: 3 }
    expect(parseMemory(serializeMemory(profile))).toEqual(profile)
  })

  test('parse returns empty object for null / garbage / wrong version', () => {
    expect(parseMemory(null)).toEqual({})
    expect(parseMemory('not json')).toEqual({})
    expect(parseMemory(JSON.stringify({ v: 99, profile: { agencyName: 'X' } }))).toEqual({})
    expect(parseMemory(JSON.stringify({ v: 1 }))).toEqual({})
  })

  test('parse keeps only known fields', () => {
    const raw = JSON.stringify({ v: 1, profile: { agencyName: 'X', hacker: 'rm -rf' } })
    expect(parseMemory(raw)).toEqual({ agencyName: 'X' })
  })

  test('parse drops fields whose type does not match the schema', () => {
    const raw = JSON.stringify({
      v: 1,
      profile: {
        agencyName: 'Duinrust', // valid string -> kept
        niche: ['not', 'a', 'string'], // wrong type -> dropped
        brandCount: { nested: 1 }, // wrong type -> dropped
        teamSize: 4, // valid number -> kept
      },
    })
    expect(parseMemory(raw)).toEqual({ agencyName: 'Duinrust', teamSize: 4 })
  })

  test('storage key is stable', () => {
    expect(MEMORY_STORAGE_KEY).toBe('clyde:memory')
  })

  test.describe('30-day expiry (loadMemory against a fake localStorage)', () => {
    const DAY = 24 * 60 * 60 * 1000
    let store: Map<string, string>
    test.beforeEach(() => {
      store = new Map([['cookieConsent', '{}']])
      ;(globalThis as { window?: unknown }).window = {
        localStorage: {
          getItem: (k: string) => store.get(k) ?? null,
          setItem: (k: string, v: string) => void store.set(k, v),
          removeItem: (k: string) => void store.delete(k),
        },
      }
    })
    test.afterEach(() => {
      delete (globalThis as { window?: unknown }).window
    })

    test('legacy profile without savedAt loads', () => {
      store.set(MEMORY_STORAGE_KEY, JSON.stringify({ v: 1, profile: { agencyName: 'X' } }))
      expect(loadMemory()).toEqual({ agencyName: 'X' })
    })

    test('profile older than 30 days is dropped', () => {
      const now = Date.now()
      store.set(
        MEMORY_STORAGE_KEY,
        JSON.stringify({ v: 1, profile: { agencyName: 'X' }, savedAt: now - 31 * DAY })
      )
      expect(loadMemory(now)).toEqual({})
      expect(store.has(MEMORY_STORAGE_KEY)).toBe(false)
    })

    test('profile younger than 30 days loads, and serialize stamps savedAt', () => {
      const now = Date.now()
      store.set(
        MEMORY_STORAGE_KEY,
        JSON.stringify({ v: 1, profile: { agencyName: 'X' }, savedAt: now - 29 * DAY })
      )
      expect(loadMemory(now)).toEqual({ agencyName: 'X' })
      expect(JSON.parse(serializeMemory({ agencyName: 'X' })).savedAt).toBeGreaterThan(now - 5000)
    })
  })
})
