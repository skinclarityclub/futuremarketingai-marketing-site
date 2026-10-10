// Run: node --experimental-strip-types --test scripts/check-apply-attribution.mjs
// No test framework in this repo, so this covers the pure pieces (shape, mapping,
// forwarder body). The route wiring is proven by tsc, lint and a live submission.
import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'
import { attributionShape, readAttribution } from '../src/lib/apply/attribution.ts'
import { sendLeadToInbox } from '../src/lib/fma-inbox-forwarder.ts'

const schema = z.object(attributionShape)

test('shape accepts a 7 char fmc', () => {
  assert.deepEqual(schema.parse({ fmc: 'Ab3dE6g' }).fmc, 'Ab3dE6g')
})

test('invalid fmc or utm parses to undefined instead of failing', () => {
  for (const bad of [{ fmc: 'x' }, { fmc: 'Ab3dE6g!' }, { fmc: 'Ab3dE6gH9k' }, { fmc: 123 }, { utm_source: 'a'.repeat(201) }]) {
    const r = schema.safeParse(bad)
    assert.equal(r.success, true, JSON.stringify(bad).slice(0, 40))
    for (const v of Object.values(r.data)) assert.equal(v, undefined)
  }
  assert.equal(schema.parse({ utm_source: 'a'.repeat(200) }).utm_source.length, 200)
})

test('a malformed fmc leaves the other valid fields intact', () => {
  const r = schema.parse({ fmc: 'x', utm_campaign: 'consult' })
  assert.equal(r.fmc, undefined)
  assert.equal(r.utm_campaign, 'consult')
  assert.deepEqual(readAttribution(r), { utm: { campaign: 'consult' } })
  assert.deepEqual(readAttribution(schema.parse({ fmc: 'x', utm_source: 'a'.repeat(201) })), {})
})

test('readAttribution maps to fmc plus utm, utm absent when unset', () => {
  assert.deepEqual(readAttribution({ fmc: 'Ab3dE6g', utm_campaign: 'consult' }), {
    fmc: 'Ab3dE6g',
    utm: { campaign: 'consult' },
  })
  assert.deepEqual(readAttribution({}), {})
})

test('sendLeadToInbox sends fmc top-level only when set', async () => {
  const saved = {
    id: process.env.FMA_INBOX_CHANNEL_ID,
    secret: process.env.FMA_INBOX_CHANNEL_SECRET,
    fetch: globalThis.fetch,
  }
  process.env.FMA_INBOX_CHANNEL_ID = 'c'
  process.env.FMA_INBOX_CHANNEL_SECRET = 's'
  const bodies = []
  globalThis.fetch = async (_url, init) => {
    bodies.push(JSON.parse(init.body))
    return { ok: true }
  }
  try {
    const base = { account_key: 'fmai_website', external_session_id: 'apply:1', origin: 'apply' }
    await sendLeadToInbox({ ...base, fmc: 'Ab3dE6g' })
    await sendLeadToInbox(base)
    assert.equal(bodies[0].fmc, 'Ab3dE6g')
    assert.equal('fmc' in bodies[1], false)
  } finally {
    globalThis.fetch = saved.fetch
    for (const [k, v] of [['FMA_INBOX_CHANNEL_ID', saved.id], ['FMA_INBOX_CHANNEL_SECRET', saved.secret]]) {
      if (v === undefined) delete process.env[k]
      else process.env[k] = v
    }
  }
})
