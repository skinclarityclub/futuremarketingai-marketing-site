import { test, expect } from '@playwright/test'
import { mergeMemory, type MemoryProfile } from '../../src/lib/chatbot/memory'

// Pure-logic spec (no browser, no API). Runs under any project; fast.
test.describe('mergeMemory', () => {
  test('adds fields into an empty profile', () => {
    const out = mergeMemory({}, { niche: 'skincare', brandCount: 8 })
    expect(out).toEqual({ niche: 'skincare', brandCount: 8 })
  })

  test('last write wins per field, keeps untouched fields', () => {
    const prev: MemoryProfile = { niche: 'skincare', brandCount: 8 }
    const out = mergeMemory(prev, { brandCount: 12 })
    expect(out).toEqual({ niche: 'skincare', brandCount: 12 })
  })

  test('ignores undefined, null and empty-string values', () => {
    const prev: MemoryProfile = { niche: 'skincare' }
    const out = mergeMemory(prev, {
      niche: undefined,
      agencyName: '',
      goal: '   ',
      painPoint: 'content volume',
    })
    expect(out).toEqual({ niche: 'skincare', painPoint: 'content volume' })
  })

  test('does not mutate the previous profile', () => {
    const prev: MemoryProfile = { niche: 'skincare' }
    mergeMemory(prev, { brandCount: 8 })
    expect(prev).toEqual({ niche: 'skincare' })
  })
})
