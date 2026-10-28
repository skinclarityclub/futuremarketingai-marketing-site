import { test, expect } from '@playwright/test'
import {
  WELCOME_MESSAGES,
  SUGGESTED_PROMPTS,
  WHISPERS,
} from '../../src/components/chatbot/widget-copy'

// Pure-logic spec (no browser, no API). EU AI Act art. 50(1): every greeting must say it is AI.
// Spanish site copy says "IA", not "AI".
const all = (o: Record<string, Record<string, string | string[]>>) =>
  Object.values(o).flatMap((m) => Object.values(m)).flat()
const AI_WORD = { nl: /\bAI\b/, en: /\bAI\b/, es: /\bIA\b/ } as const

test('every greeting names AI', () => {
  for (const loc of ['nl', 'en', 'es'] as const)
    for (const g of Object.values(WELCOME_MESSAGES[loc])) expect(g).toMatch(AI_WORD[loc])
})
test('three suggested prompts per path', () => {
  for (const loc of ['nl', 'en', 'es'] as const)
    for (const list of Object.values(SUGGESTED_PROMPTS[loc])) expect(list).toHaveLength(3)
})
test('whispers exist per locale with identical keys', () => {
  expect(Object.keys(WHISPERS.en).sort()).toEqual(Object.keys(WHISPERS.nl).sort())
  expect(Object.keys(WHISPERS.es).sort()).toEqual(Object.keys(WHISPERS.nl).sort())
})
test('no em-dash in widget copy', () => {
  for (const s of [...all(WELCOME_MESSAGES), ...all(SUGGESTED_PROMPTS), ...all(WHISPERS)])
    expect(s).not.toContain('—')
})
