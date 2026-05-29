import { test, expect } from '@playwright/test'
import { buildMemoryContextLine } from '../../src/lib/chatbot/prompt-builder'

// Pure-logic spec (no browser, no API). Verifies the system-prompt recall line.
test('empty / undefined profile yields no line', () => {
  expect(buildMemoryContextLine(undefined)).toBe('')
  expect(buildMemoryContextLine({})).toBe('')
})

test('non-empty profile yields a recall line with only known fields', () => {
  const line = buildMemoryContextLine({ agencyName: 'Duinrust', niche: 'horeca', brandCount: 6 })
  expect(line).toContain('Duinrust')
  expect(line).toContain('horeca')
  expect(line).toContain('6 brands')
  expect(line).not.toContain('team of')
})
