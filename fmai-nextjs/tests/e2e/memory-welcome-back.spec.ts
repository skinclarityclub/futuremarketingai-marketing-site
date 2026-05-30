import { test, expect } from '@playwright/test'
import { welcomeBackMessage } from '../../src/components/chatbot/welcome-back'

// Pure-logic spec (no browser, no API). Verifies the localized welcome-back line.
test('null without agencyName', () => {
  expect(welcomeBackMessage('nl', {})).toBeNull()
  expect(welcomeBackMessage('nl', { niche: 'horeca' })).toBeNull()
})

test('localized greetings, no em-dashes', () => {
  const p = { agencyName: 'Duinrust', niche: 'horeca', brandCount: 6 }
  for (const loc of ['nl', 'en', 'es'] as const) {
    const m = welcomeBackMessage(loc, p)!
    expect(m).toContain('Duinrust')
    expect(m).not.toContain('—')
  }
  expect(welcomeBackMessage('nl', p)).toContain('horeca')
  expect(welcomeBackMessage('es', p)).toContain('marcas')
})
