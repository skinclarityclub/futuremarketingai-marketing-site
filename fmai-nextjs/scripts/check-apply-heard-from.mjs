// Run: node --experimental-strip-types --test scripts/check-apply-heard-from.mjs
// Covers the pure pieces (list, lenient shape, resolve). The route wiring is proven by
// tsc, lint and the Playwright spec tests/e2e/apply-heard-from.spec.ts, as with attribution.
import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'
import { HEARD_FROM, heardFromShape, resolveHeardFrom } from '../src/lib/apply/heard-from.ts'

const schema = z.object(heardFromShape)

test('the list and its order are fixed', () => {
  assert.deepEqual(
    [...HEARD_FROM],
    ['linkedin', 'google', 'ai_assistant', 'instagram', 'podcast_event', 'referral', 'partner', 'other', 'unknown'],
  )
})

test('every list value parses and resolves to itself', () => {
  for (const v of HEARD_FROM) {
    const r = schema.parse({ heardFrom: v })
    assert.equal(r.heardFrom, v)
    assert.equal(resolveHeardFrom(r.heardFrom), v)
  }
})

test('missing, unknown, wrong type and a client-sent not_asked all become not_asked', () => {
  for (const body of [{}, { heardFrom: 'xyz' }, { heardFrom: 123 }, { heardFrom: 'not_asked' }, { heardFrom: null }]) {
    const r = schema.safeParse(body)
    assert.equal(r.success, true, JSON.stringify(body))
    assert.equal(r.data.heardFrom, undefined)
    assert.equal(resolveHeardFrom(r.data.heardFrom), 'not_asked')
  }
})

test('an extra field such as heardFromOther is dropped', () => {
  const r = schema.parse({ heardFrom: 'linkedin', heardFromOther: '06 12 34 56 78' })
  assert.deepEqual(r, { heardFrom: 'linkedin' })
  assert.equal('heardFromOther' in r, false)
})
