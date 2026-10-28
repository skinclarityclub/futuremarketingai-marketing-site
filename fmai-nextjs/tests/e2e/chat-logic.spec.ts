import { test, expect } from '@playwright/test'
import { limitState } from '../../src/lib/chatbot/message-limit'
import { classifyChatError } from '../../src/lib/chatbot/chat-error'
import { buildSystemMessages } from '../../src/lib/chatbot/prompt-builder'
import { clydePersona } from '../../src/lib/chatbot/personas'

// Pure-logic spec (no browser, no API). Runs under any project; fast.
test('limitState', () => {
  expect(limitState(0)).toEqual({ remaining: 15, warn: false, atLimit: false })
  expect(limitState(12)).toEqual({ remaining: 3, warn: true, atLimit: false })
  expect(limitState(15)).toEqual({ remaining: 0, warn: false, atLimit: true })
  expect(limitState(40)).toEqual({ remaining: 0, warn: false, atLimit: true })
})

test('classifyChatError', () => {
  const now = 1_000_000
  expect(classifyChatError(undefined, now)).toBeNull()
  const body = JSON.stringify({
    error: 'Rate limit exceeded',
    limitType: 'ip',
    resetAt: now + 150_000,
  })
  expect(classifyChatError(new Error(body), now)).toEqual({ kind: 'rate-limit', minutes: 3 })
  expect(
    classifyChatError(new Error(JSON.stringify({ error: 'Rate limit exceeded' })), now)
  ).toEqual({ kind: 'rate-limit', minutes: 1 })
  expect(classifyChatError(new Error('Failed to fetch the chat response.'), now)).toEqual({
    kind: 'failed',
  })
  expect(classifyChatError(new Error('{"error":"Invalid JSON body"}'), now)).toEqual({
    kind: 'failed',
  })
  expect(
    classifyChatError(
      new Error('{"error":"Please don\'t share personal information like email"}'),
      now
    )
  ).toEqual({ kind: 'rejected', reason: 'personal' })
  expect(
    classifyChatError(new Error('{"error":"Message too long (max 2000 characters)"}'), now)
  ).toEqual({ kind: 'rejected', reason: 'too-long' })
  expect(classifyChatError(new Error('{"error":"Message cannot be empty"}'), now)).toEqual({
    kind: 'failed',
  })
})

// qualify_lead renders no card (spec 9), so the prompt must send fit questions to the
// application card instead and must not point at a panel that no longer exists.
test('demo prompt: fit step ends in the application card, no side panel', () => {
  const text = buildSystemMessages(
    clydePersona,
    { topics: [], knowledgeContent: '', estimatedTokens: 0 },
    { language: 'nl', demoMode: true }
  )
    .map((m) => m.content)
    .join('\n')
  expect(text).not.toMatch(/side panel/i)
  expect(text).toContain('qualify_lead')
  expect(text).toMatch(/never state a score/)
  expect(text).toMatch(/hot or warm also call book_call/)
})
