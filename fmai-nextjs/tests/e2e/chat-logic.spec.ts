import { test, expect } from '@playwright/test'
import { limitState } from '../../src/lib/chatbot/message-limit'
import { classifyChatError } from '../../src/lib/chatbot/chat-error'

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
  const body = JSON.stringify({ error: 'Rate limit exceeded', limitType: 'ip', resetAt: now + 150_000 })
  expect(classifyChatError(new Error(body), now)).toEqual({ kind: 'rate-limit', minutes: 3 })
  expect(classifyChatError(new Error(JSON.stringify({ error: 'Rate limit exceeded' })), now)).toEqual({ kind: 'rate-limit', minutes: 1 })
  expect(classifyChatError(new Error('Failed to fetch the chat response.'), now)).toEqual({ kind: 'failed' })
  expect(classifyChatError(new Error('{"error":"Invalid JSON body"}'), now)).toEqual({ kind: 'failed' })
  expect(classifyChatError(new Error('{"error":"Please don\'t share personal information like email"}'), now)).toEqual({ kind: 'rejected', reason: 'personal' })
  expect(classifyChatError(new Error('{"error":"Message too long (max 2000 characters)"}'), now)).toEqual({ kind: 'rejected', reason: 'too-long' })
  expect(classifyChatError(new Error('{"error":"Message cannot be empty"}'), now)).toEqual({ kind: 'failed' })
})
