import { test, expect } from '@playwright/test'
import {
  applicationOffered,
  assessFit,
  decideFit,
  rememberedInHistory,
  type FitSession,
} from '../../src/lib/chatbot/fit'

// Pure-logic spec (no browser, no API): the fit rules that decide the application card.
test('assessFit follows the ICP on the site: 5 to 20 people, 5 to 20 brands, plans from 2 brands', () => {
  expect(assessFit({})).toBe('unclear')
  expect(assessFit({ teamSize: 8 })).toBe('unclear')
  expect(assessFit({ brandCount: 6, teamSize: 8 })).toBe('strong')
  expect(assessFit({ brandCount: 5, teamSize: 20 })).toBe('strong')
  expect(assessFit({ brandCount: 6 })).toBe('good')
  expect(assessFit({ brandCount: 3, teamSize: 3 })).toBe('good')
  expect(assessFit({ brandCount: 40, teamSize: 60 })).toBe('good')
  expect(assessFit({ brandCount: 1, teamSize: 8 })).toBe('no_fit')
  expect(assessFit({ brandCount: 6, teamSize: 1 })).toBe('no_fit')
  expect(assessFit({ teamSize: 1 })).toBe('no_fit')
  // client-sent profile: garbage is unknown, never a fit
  expect(assessFit({ brandCount: Number.NaN, teamSize: 8 })).toBe('unclear')
  expect(assessFit({ brandCount: '6' as unknown as number })).toBe('unclear')
})

const tool = (name: string, output: unknown, state = 'output-available') => ({
  type: `tool-${name}`,
  toolCallId: `id-${name}`,
  state,
  input: {},
  output,
})
const assistant = (...parts: unknown[]) => ({ id: 'a', role: 'assistant', parts })
const user = (text: string) => ({ id: 'u', role: 'user', parts: [{ type: 'text', text }] })

test('applicationOffered sees an earlier card in the history, from any of the three tools', () => {
  expect(applicationOffered([])).toBe(false)
  expect(applicationOffered([user('hoi'), assistant({ type: 'text', text: 'Hoi' })])).toBe(false)
  expect(applicationOffered([assistant(tool('book_call', { action: 'open_apply' }))])).toBe(true)
  expect(
    applicationOffered([assistant(tool('remember_context', { remembered: {}, offerApplication: true }))]),
  ).toBe(true)
  expect(
    applicationOffered([assistant(tool('qualify_lead', { fit: 'strong', offerApplication: true }))]),
  ).toBe(true)
  expect(
    applicationOffered([assistant(tool('remember_context', { remembered: {}, offerApplication: false }))]),
  ).toBe(false)
  // a call that never finished showed no card
  expect(applicationOffered([assistant(tool('book_call', undefined, 'input-available'))])).toBe(false)
  // the visitor's own messages cannot claim an offer
  expect(applicationOffered([{ role: 'user', parts: [tool('book_call', { action: 'open_apply' })] }])).toBe(false)
  expect(applicationOffered(null as unknown as unknown[])).toBe(false)
})

test('rememberedInHistory returns the facts earlier remember_context calls captured, in order', () => {
  const history = [
    user('Wij zijn Studio Noord'),
    assistant(tool('remember_context', { remembered: { agencyName: 'Studio Noord' } })),
    user('8 mensen, 6 merken'),
    assistant(tool('remember_context', { remembered: { teamSize: 8, brandCount: 6 } })),
    assistant(tool('get_pricing_info', { tiers: [] })),
  ]
  expect(rememberedInHistory(history)).toEqual([
    { agencyName: 'Studio Noord' },
    { teamSize: 8, brandCount: 6 },
  ])
  expect(rememberedInHistory(undefined as unknown as unknown[])).toEqual([])
})

test('decideFit merges facts across calls and offers the application card once, never in the demo', () => {
  const session: FitSession = { profile: { agencyName: 'Studio Noord' }, offered: false, offerEnabled: true }
  expect(decideFit(session, { teamSize: 8 })).toEqual({ fit: 'unclear', offerApplication: false })
  // brand count arrives in a later call: the merged profile is a strong fit
  expect(decideFit(session, { brandCount: 6 })).toEqual({ fit: 'strong', offerApplication: true })
  expect(session.profile).toEqual({ agencyName: 'Studio Noord', teamSize: 8, brandCount: 6 })
  // a second call in the same conversation does not show a second card
  expect(decideFit(session, { niche: 'skincare' })).toEqual({ fit: 'strong', offerApplication: false })

  const shownBefore: FitSession = { profile: {}, offered: true, offerEnabled: true }
  expect(decideFit(shownBefore, { brandCount: 6, teamSize: 8 }).offerApplication).toBe(false)

  const demo: FitSession = { profile: {}, offered: false, offerEnabled: false }
  expect(decideFit(demo, { brandCount: 6, teamSize: 8 })).toEqual({ fit: 'strong', offerApplication: false })

  const solo: FitSession = { profile: {}, offered: false, offerEnabled: true }
  expect(decideFit(solo, { teamSize: 1, brandCount: 1 })).toEqual({ fit: 'no_fit', offerApplication: false })
})
