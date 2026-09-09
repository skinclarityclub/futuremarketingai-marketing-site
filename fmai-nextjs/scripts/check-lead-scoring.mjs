/**
 * Zelftoets voor de lead-doorvoer naar de Lead Qualifier (T1.3).
 *
 * WHY: de score-normalisatie en de labelbanden zijn de enige plek waar dit werk
 * kan rekenen, en de duurste fout is stil: een lauwe aanvraag die als de heetste
 * lead van de lijst binnenkomt. Geen testrunner in deze repo, dus een kaal
 * node:assert-script zonder dependencies.
 *
 * Draaien: node --experimental-strip-types scripts/check-lead-scoring.mjs
 */
import assert from 'node:assert/strict'
import {
  normalizeLeadScore,
  qualificationFromScore,
  sendLeadToInbox,
} from '../src/lib/fma-inbox-forwarder.ts'
import { MAX_SCORE_FULL, MAX_SCORE_HANDOFF, QUALIFIED_THRESHOLD } from '../src/lib/apply/questions.ts'

let checks = 0
function check(label, fn) {
  fn()
  checks++
  console.log(`  ok  ${label}`)
}

console.log('normalizeLeadScore')
check('de wizard-uitersten landen op 0 en 100', () => {
  assert.equal(normalizeLeadScore(0, MAX_SCORE_FULL), 0)
  assert.equal(normalizeLeadScore(MAX_SCORE_FULL, MAX_SCORE_FULL), 100)
  assert.equal(normalizeLeadScore(MAX_SCORE_HANDOFF, MAX_SCORE_HANDOFF), 100)
})
check('rondt af en blijft binnen 0..100', () => {
  assert.equal(normalizeLeadScore(7, 17), 41)
  assert.equal(normalizeLeadScore(12, 17), 71)
  assert.equal(normalizeLeadScore(6, 12), 50)
  assert.equal(normalizeLeadScore(99, 17), 100)
  assert.equal(normalizeLeadScore(-5, 17), 0)
})
check('een onbruikbare max geeft 0 in plaats van NaN of Infinity', () => {
  assert.equal(normalizeLeadScore(5, 0), 0)
  assert.equal(normalizeLeadScore(5, -1), 0)
  assert.equal(normalizeLeadScore(Number.NaN, 17), 0)
  assert.equal(normalizeLeadScore(5, Number.NaN), 0)
})

console.log('qualificationFromScore')
check('de banden liggen op 86 / 61 / 31, precies als qualify_lead in de chat', () => {
  assert.equal(qualificationFromScore(100), 'qualified')
  assert.equal(qualificationFromScore(86), 'qualified')
  assert.equal(qualificationFromScore(85), 'hot')
  assert.equal(qualificationFromScore(61), 'hot')
  assert.equal(qualificationFromScore(60), 'warm')
  assert.equal(qualificationFromScore(31), 'warm')
  assert.equal(qualificationFromScore(30), 'cold')
  assert.equal(qualificationFromScore(0), 'cold')
})
check('de qualified-branch is GEEN on_fire — de hele reden dat branch niet het label is', () => {
  const atThreshold = normalizeLeadScore(QUALIFIED_THRESHOLD, MAX_SCORE_FULL)
  assert.equal(atThreshold, 41)
  assert.equal(qualificationFromScore(atThreshold), 'warm')
})

console.log('sendLeadToInbox')
const realFetch = globalThis.fetch
const realEnv = { ...process.env }
function restore() {
  globalThis.fetch = realFetch
  process.env = { ...realEnv }
}

{
  delete process.env.FMA_INBOX_CHANNEL_ID
  delete process.env.FMA_INBOX_CHANNEL_SECRET
  let called = false
  globalThis.fetch = () => {
    called = true
    return Promise.resolve(new Response('{}', { status: 200 }))
  }
  const out = await sendLeadToInbox({
    account_key: 'fmai_website',
    external_session_id: 'apply:x',
    origin: 'apply',
    email: 'a@b.nl',
  })
  restore()
  check('dormant zonder env: geen enkele call, geeft false', () => {
    assert.equal(out, false)
    assert.equal(called, false)
  })
}

async function withStubbedFetch(fn) {
  process.env.FMA_INBOX_CHANNEL_ID = 'chan'
  process.env.FMA_INBOX_CHANNEL_SECRET = 'shh'
  process.env.FMA_INBOX_URL = 'http://inbox.test/api/webhooks/inbox'
  let seen = null
  globalThis.fetch = (url, init) => {
    seen = { url, init, body: JSON.parse(init.body) }
    return Promise.resolve(new Response('{"ok":true}', { status: 200 }))
  }
  const out = await fn()
  restore()
  return { seen, out }
}

{
  const { seen, out } = await withStubbedFetch(() =>
    sendLeadToInbox({
      account_key: 'fmai_website',
      external_session_id: 'apply:0f1c',
      origin: 'apply',
      name: 'Test Persoon',
      email: 'test@example.com',
      company: 'Bureau X',
      score: 41,
      qualification: 'warm',
      metadata: { branch: 'qualified', score_raw: 7, score_max: 17 },
    }),
  )
  check('een volle lead draagt de envelope die InboundLeadSchema eist', () => {
    assert.equal(out, true)
    assert.equal(seen.init.headers['x-inbox-secret'], 'shh')
    assert.equal(seen.body.type, 'lead')
    assert.equal(seen.body.vendor, 'own-bot')
    assert.equal(seen.body.origin, 'apply')
    assert.equal(seen.body.score, 41)
    assert.equal(seen.body.qualification, 'warm')
    assert.equal(seen.body.company, 'Bureau X')
    assert.equal(seen.body.metadata.branch, 'qualified')
    // organization_id komt NOOIT uit de body; de app leidt hem af uit het geheim.
    assert.equal('organization_id' in seen.body, false)
    assert.equal('account_key' in seen.body, true)
  })
}

{
  const { seen, out } = await withStubbedFetch(() =>
    sendLeadToInbox({
      account_key: 'fmai_website',
      external_session_id: 'contact:9a2b',
      origin: 'contact',
      name: 'Test Persoon',
      email: 'test@example.com',
      company: '',
      metadata: { locale: 'nl', message: 'hallo' },
    }),
  )
  check('een leeg veld gaat NIET mee, anders wist de upsert een eerdere waarde', () => {
    assert.equal(out, true)
    assert.equal('company' in seen.body, false)
    assert.equal('score' in seen.body, false)
    assert.equal('qualification' in seen.body, false)
    assert.equal('phone' in seen.body, false)
    assert.equal(seen.body.metadata.locale, 'nl')
  })
}

{
  process.env.FMA_INBOX_CHANNEL_ID = 'chan'
  process.env.FMA_INBOX_CHANNEL_SECRET = 'shh'
  globalThis.fetch = () => Promise.reject(new Error('netwerk weg'))
  const out = await sendLeadToInbox({
    account_key: 'fmai_website',
    external_session_id: 'apply:err',
    origin: 'apply',
    email: 'a@b.nl',
  })
  restore()
  check('een netwerkfout gooit niet, maar meldt false — mail en alert blijven staan', () => {
    assert.equal(out, false)
  })
}

{
  process.env.FMA_INBOX_CHANNEL_ID = 'chan'
  process.env.FMA_INBOX_CHANNEL_SECRET = 'shh'
  globalThis.fetch = () => Promise.resolve(new Response('nope', { status: 401 }))
  const out = await sendLeadToInbox({
    account_key: 'fmai_website',
    external_session_id: 'apply:401',
    origin: 'apply',
    email: 'a@b.nl',
  })
  restore()
  check('een 401 van de webhook geeft false, geen throw', () => {
    assert.equal(out, false)
  })
}

console.log(`\n${checks} checks groen`)
