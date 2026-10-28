import { test, expect } from '@playwright/test'
import {
  applicationOffered,
  assessFit,
  decideFit,
  fitSession,
  rememberedInHistory,
  type FitSession,
} from '../../src/lib/chatbot/fit'
import { buildFlagshipTools } from '../../src/lib/chatbot/tools/flagship-tools'
import { buildLeadgenTools } from '../../src/lib/chatbot/tools/leadgen-tools'

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

test('fitSession builds the request state from the client profile and history, dropping garbage', () => {
  const history = [
    user('8 mensen'),
    assistant(tool('remember_context', { remembered: { teamSize: 8, __proto__x: 1, brandCount: '6' } })),
  ]
  // the client profile is untrusted: unknown keys and wrong types are dropped, history wins per field
  const forged = { agencyName: 'Studio Noord', brandCount: 6, teamSize: 'veel', isAdmin: true }
  expect(fitSession(history, forged, false)).toEqual({
    profile: { agencyName: 'Studio Noord', brandCount: 6, teamSize: 8 },
    offered: false,
    offerEnabled: true,
  })
  expect(fitSession(undefined, 'not an object', false).profile).toEqual({})
  expect(fitSession([assistant(tool('book_call', { action: 'open_apply' }))], {}, false).offered).toBe(true)
  expect(fitSession([], {}, true).offerEnabled).toBe(false)
})

const call = { toolCallId: 't', messages: [] }

test('remember_context decides fit in code and offers the card once the facts are in', async () => {
  const session: FitSession = { profile: { teamSize: 8 }, offered: false, offerEnabled: true }
  const { remember_context } = buildFlagshipTools('nl', session)
  expect(await remember_context.execute!({ agencyName: 'Studio Noord' }, call)).toMatchObject({
    fit: 'unclear',
    offerApplication: false,
  })
  expect(await remember_context.execute!({ brandCount: 6 }, call)).toMatchObject({
    remembered: { brandCount: 6 },
    fit: 'strong',
    offerApplication: true,
  })
  // qualify_lead in the same request shares the session: no second card
  const { qualify_lead } = buildFlagshipTools('nl', session)
  expect(await qualify_lead.execute!({}, call)).toEqual({ fit: 'strong', offerApplication: false })
})

test('get_roi_estimate counts only stated input, asks for the rest, caps hours per person', async () => {
  const session: FitSession = { profile: { teamSize: 8 }, offered: false, offerEnabled: true }
  const { get_roi_estimate } = buildLeadgenTools('nl', session)
  const run = (input: Parameters<NonNullable<typeof get_roi_estimate.execute>>[0]) =>
    get_roi_estimate.execute!(input, call)
  expect(await run({ teamSize: 8, monthlySubscription: 998 })).toEqual({ needsInput: ['teamHoursPerWeek'] })
  // team size comes from what the visitor told remember_context; the rate is an assumption
  expect(await run({ teamHoursPerWeek: 40, monthlySubscription: 2394 })).toMatchObject({
    monthlySavings: 5606,
    roiPercent: 234,
    breakdown: { teamSize: 8, teamHoursPerWeek: 40, hoursSavedPerWeek: 40, hourlyRate: 50, rateAssumed: true },
  })
  expect(await run({ teamSize: 2, teamHoursPerWeek: 100, averageHourlyRate: 80, monthlySubscription: 998 })).toMatchObject({
    breakdown: { hoursSavedPerWeek: 30, hourlyRate: 80, rateAssumed: false },
  })
  const unknownTeam = buildLeadgenTools('nl').get_roi_estimate
  expect(await unknownTeam.execute!({ teamHoursPerWeek: 0, monthlySubscription: 998 }, call)).toEqual({
    needsInput: ['teamSize', 'teamHoursPerWeek'],
  })
})
