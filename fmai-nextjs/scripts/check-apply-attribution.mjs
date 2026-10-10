// Run: node --experimental-strip-types --test scripts/check-apply-attribution.mjs
// No test framework in this repo, so this covers the pure pieces (shape, mapping,
// forwarder body). The route wiring is proven by tsc, lint and a live submission.
import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'
import { attributionShape, readAttribution } from '../src/lib/apply/attribution.ts'
import { sendLeadToInbox } from '../src/lib/fma-inbox-forwarder.ts'

const schema = z.object(attributionShape)

test('shape accepts a 7 char fmc and rejects malformed ones', () => {
  assert.equal(schema.safeParse({ fmc: 'Ab3dE6g' }).success, true)
  for (const fmc of ['x', 'Ab3dE6g!', 'Ab3dE6gH9k']) {
    assert.equal(schema.safeParse({ fmc }).success, false, fmc)
  }
})

test('shape caps utm fields at 200 chars', () => {
  assert.equal(schema.safeParse({ utm_source: 'a'.repeat(200) }).success, true)
  assert.equal(schema.safeParse({ utm_source: 'a'.repeat(201) }).success, false)
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
