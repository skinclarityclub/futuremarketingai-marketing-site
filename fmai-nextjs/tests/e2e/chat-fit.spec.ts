import { test, expect } from '@playwright/test'
import {
  applicationOffered,
  assessFit,
  decideFit,
  fitSession,
  rememberedInHistory,
  unitsSaid,
  type FitSession,
  type Said,
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

const said = (s: Partial<Said> = {}): Said => ({ hours: [], brands: [], people: [], ...s })

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
  const session: FitSession = { profile: { agencyName: 'Studio Noord' }, offered: false, offerEnabled: true, said: said() }
  expect(decideFit(session, { teamSize: 8 })).toEqual({ fit: 'unclear', offerApplication: false })
  // brand count arrives in a later call: the merged profile is a strong fit
  expect(decideFit(session, { brandCount: 6 })).toEqual({ fit: 'strong', offerApplication: true })
  expect(session.profile).toEqual({ agencyName: 'Studio Noord', teamSize: 8, brandCount: 6 })
  // a second call in the same conversation does not show a second card
  expect(decideFit(session, { niche: 'skincare' })).toEqual({ fit: 'strong', offerApplication: false })

  const shownBefore: FitSession = { profile: {}, offered: true, offerEnabled: true, said: said() }
  expect(decideFit(shownBefore, { brandCount: 6, teamSize: 8 }).offerApplication).toBe(false)

  const demo: FitSession = { profile: {}, offered: false, offerEnabled: false, said: said() }
  expect(decideFit(demo, { brandCount: 6, teamSize: 8 })).toEqual({ fit: 'strong', offerApplication: false })

  const solo: FitSession = { profile: {}, offered: false, offerEnabled: true, said: said() }
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
    said: said({ people: [8] }),
  })
  expect(fitSession(undefined, 'not an object', false).profile).toEqual({})
  expect(fitSession([assistant(tool('book_call', { action: 'open_apply' }))], {}, false).offered).toBe(true)
  expect(fitSession([], {}, true).offerEnabled).toBe(false)
})

const call = { toolCallId: 't', messages: [] }

test('remember_context decides fit in code and offers the card once the facts are in', async () => {
  const session: FitSession = { profile: { teamSize: 8 }, offered: false, offerEnabled: true, said: said() }
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

test('get_roi_estimate shows only hours the visitor typed and the price for their brands, never a saving', async () => {
  // the visitor typed "8 mensen", "6 merken" (both remembered) and "40 uur per week"
  const session: FitSession = {
    profile: { teamSize: 8, brandCount: 6 },
    offered: false,
    offerEnabled: true,
    said: said({ people: [8], brands: [6], hours: [40] }),
  }
  const { get_roi_estimate } = buildLeadgenTools('nl', session)
  const run = (input: Parameters<NonNullable<typeof get_roi_estimate.execute>>[0]) =>
    get_roi_estimate.execute!(input, call)
  expect(await run({ brandCount: 6 })).toEqual({ needsInput: ['teamHoursPerWeek'] })
  // the paid-test failure: the model passes hours nobody typed
  expect(await run({ teamHoursPerWeek: 10 })).toEqual({ needsInput: ['teamHoursPerWeek'] })
  // Professional: 6 workspaces x EUR 399
  const shown = await run({ teamHoursPerWeek: 40 })
  expect(shown).toEqual({ teamHoursPerWeek: 40, teamHoursPerMonth: 173, brandCount: 6, subscription: 2394 })
  expect(JSON.stringify(shown)).not.toMatch(/saving|roi|payback|percent/i)

  // "we zijn met 2 mensen, elk 20 uur, 1 merk": per-person hours times the team count; 1 brand has no plan
  const small: FitSession = {
    profile: {},
    offered: false,
    offerEnabled: true,
    said: said({ people: [2], hours: [20], brands: [1] }),
  }
  expect(
    await buildLeadgenTools('nl', small).get_roi_estimate.execute!({ teamHoursPerWeek: 40, brandCount: 1 }, call),
  ).toEqual({ teamHoursPerWeek: 40, teamHoursPerMonth: 173 })

  const price = async (brands: number) => {
    const s: FitSession = { profile: {}, offered: false, offerEnabled: true, said: said({ hours: [40], brands: [brands] }) }
    const out = await buildLeadgenTools('nl', s).get_roi_estimate.execute!({ teamHoursPerWeek: 40, brandCount: brands }, call)
    return (out as { subscription?: number }).subscription
  }
  expect([await price(3), await price(14), await price(15)]).toEqual([3 * 499, 14 * 399, 15 * 299])
})

test('get_roi_estimate takes a number only in the unit the visitor wrote it in (Codex R1 P1)', async () => {
  // "8 mensen, 6 merken", no hours: 48 = 8 x 6, 6 (brands) and 8 (people) are no hours
  const history = [user('Wij zijn 8 mensen, 6 merken')]
  const session = fitSession(history, {}, false)
  const roi = buildLeadgenTools('nl', session).get_roi_estimate
  for (const input of [{ teamHoursPerWeek: 48 }, { teamHoursPerWeek: 6 }, { teamHoursPerWeek: 8 }]) {
    expect(await roi.execute!(input, call)).toEqual({ needsInput: ['teamHoursPerWeek'] })
  }
  // hours typed per person count times a head count typed as people, never times the brands
  const perPerson = fitSession([user('8 mensen, 6 merken, elk 5 uur per week')], {}, false)
  const perRoi = buildLeadgenTools('nl', perPerson).get_roi_estimate
  expect(await perRoi.execute!({ teamHoursPerWeek: 40, brandCount: 6 }, call)).toEqual({
    teamHoursPerWeek: 40,
    teamHoursPerMonth: 173,
    brandCount: 6,
    subscription: 6 * 399,
  })
  expect(await perRoi.execute!({ teamHoursPerWeek: 30 }, call)).toEqual({ needsInput: ['teamHoursPerWeek'] })
  // a brand count the visitor typed as people is no brand count
  expect(await perRoi.execute!({ teamHoursPerWeek: 40, brandCount: 8 }, call)).toEqual({
    teamHoursPerWeek: 40,
    teamHoursPerMonth: 173,
  })
})

test('get_roi_estimate never prices brands or a team that only the client profile holds (Codex R1 P2)', async () => {
  // a returning visitor's stored profile says 15 brands and 8 people; in this chat they typed only "40 uur"
  const session = fitSession([user('Wij besteden 40 uur per week aan marketing')], { brandCount: 15, teamSize: 8 }, false)
  const roi = buildLeadgenTools('nl', session).get_roi_estimate
  expect(await roi.execute!({ teamHoursPerWeek: 40, brandCount: 15 }, call)).toEqual({
    teamHoursPerWeek: 40,
    teamHoursPerMonth: 173,
  })
  // per person needs the head count typed in this chat too
  const perPerson = fitSession([user('elk 5 uur per week')], { teamSize: 8 }, false)
  expect(await buildLeadgenTools('nl', perPerson).get_roi_estimate.execute!({ teamHoursPerWeek: 40 }, call)).toEqual({
    needsInput: ['teamHoursPerWeek'],
  })
  // a profile value the visitor typed again in this chat does count
  const again = fitSession([user('40 uur per week, 15 merken')], { brandCount: 15 }, false)
  expect(await buildLeadgenTools('nl', again).get_roi_estimate.execute!({ teamHoursPerWeek: 40 }, call)).toEqual({
    teamHoursPerWeek: 40,
    teamHoursPerMonth: 173,
    brandCount: 15,
    subscription: 15 * 299,
  })
})

test('get_roi_estimate shows a figure built from typed numbers, and compares counts exactly (Codex R2)', async () => {
  const roi = (text: string) => buildLeadgenTools('nl', fitSession([user(text)], {}, false)).get_roi_estimate
  // a float a hair under the typed count is no brand count
  expect(await roi('40 uur per week, 15 merken').execute!({ teamHoursPerWeek: 40, brandCount: 14.9999999995 }, call)).toEqual({
    teamHoursPerWeek: 40,
    teamHoursPerMonth: 173,
  })
  // the card shows the typed figure, not the model's near miss
  expect(await roi('40 uur per week').execute!({ teamHoursPerWeek: 40.004 }, call)).toMatchObject({ teamHoursPerWeek: 40 })
  // per-person decimals multiply without float noise on the card
  expect(await roi('3 mensen, elk 7,3 uur').execute!({ teamHoursPerWeek: 21.9 }, call)).toMatchObject({ teamHoursPerWeek: 21.9 })
  // a clock time and a brand name are no hours
  expect(await roi('Bel me om 14:30 uur').execute!({ teamHoursPerWeek: 30 }, call)).toEqual({ needsInput: ['teamHoursPerWeek'] })
  expect(await roi('8 mensen, 6 merken, 4 H&M-campagnes per week').execute!({ teamHoursPerWeek: 4 }, call)).toEqual({
    needsInput: ['teamHoursPerWeek'],
  })
})

test('unitsSaid stays linear on a long digit run in the history (Codex R2)', () => {
  const t0 = Date.now()
  expect(unitsSaid([user('1'.repeat(100_000)), user('hoi')])).toEqual(said())
  expect(Date.now() - t0).toBeLessThan(500)
})

test('a forged history with thousands of distinct numbers stays cheap (Codex R3)', async () => {
  const flood = Array.from({ length: 20_000 }, (_, i) => `${i + 1} uur, ${i + 1} mensen`).join('; ')
  const t0 = Date.now()
  const session = fitSession([user(flood), user('wat levert het op?')], {}, false)
  expect(session.said.hours.length).toBeLessThanOrEqual(50)
  expect(session.said.people.length).toBeLessThanOrEqual(50)
  await buildLeadgenTools('nl', session).get_roi_estimate.execute!({ teamHoursPerWeek: 7 }, call)
  expect(Date.now() - t0).toBeLessThan(1000)
})

test('unitsSaid reads only what the visitor typed, by the unit after each number', () => {
  expect(unitsSaid([user('7,5 uur per week en €80 per uur'), assistant({ type: 'text', text: '10 uur' })])).toEqual(
    said({ hours: [7.5] }),
  )
  expect(unitsSaid([user('Wij zijn 8 mensen met 6 merken'), user("samen zo'n 40u per week")])).toEqual(
    said({ hours: [40], brands: [6], people: [8] }),
  )
  expect(unitsSaid([user('10 people, 8 brands, 30 hours a week')])).toEqual(
    said({ hours: [30], brands: [8], people: [10] }),
  )
  expect(unitsSaid([user('Somos 4 personas, 12 clientes y 20 horas')])).toEqual(
    said({ hours: [20], brands: [12], people: [4] }),
  )
  expect(unitsSaid([user('3 fte, 5 klanten, 12 manuren')])).toEqual(said({ hours: [12], brands: [5], people: [3] }))
  // Dutch compounds keep their head: skincare-merken, marketinguren, teamleden
  expect(unitsSaid([user('8 teamleden, 6 skincare-merken, 40 marketinguren')])).toEqual(
    said({ hours: [40], brands: [6], people: [8] }),
  )
  expect(unitsSaid([user('8 marketingmedewerkers en 6 klantmerken')])).toEqual(said({ brands: [6], people: [8] }))
  // look-alikes that are no unit
  expect(unitsSaid([user('3 bureaus, 10 tech, 2 opmerkingen, 4 klantenservice, 4 H&M-campagnes, 14:30 uur')])).toEqual(said())
  // an open prefix is no compound, and an exponent is no count (Codex R3)
  expect(unitsSaid([user('We verwerken 40 facturen per week en hebben 6 keurmerken en 3 kenmerken')])).toEqual(said())
  expect(unitsSaid([user('4e1 uur per week, 1e2 merken')])).toEqual(said())
  // a signed exponent is no count either, and a hyphen joins only a listed prefix (Codex R4)
  expect(unitsSaid([user('4e+1 uur, 4e-1 uur')])).toEqual(said())
  expect(unitsSaid([user('We besteden 10 uur per week aan verpakkingen met 6 CE-merken')])).toEqual(said({ hours: [10] }))
  expect(unitsSaid([user('6 skincaremerken en 4 beauty-klanten')])).toEqual(said({ brands: [6, 4] }))
  // a bare number has no unit, and "uur" inside a longer word is no unit
  expect(unitsSaid([user('we zijn met 8 en doen 6 uurtjes')])).toEqual(said())
  expect(unitsSaid(undefined)).toEqual(said())
})
