import { test, expect } from '@playwright/test'
import {
  serializeMemory,
  parseMemory,
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

  test('storage key is stable', () => {
    expect(MEMORY_STORAGE_KEY).toBe('clyde:memory')
  })
})
