/**
 * AI Readiness Assessment — 16-question SSoT.
 *
 * Categories (4 questions each):
 *   strategy — vision, executive commitment, measurable outcomes, AI Act alignment
 *   data     — knowledge organisation, reporting maturity, 1st-party data depth
 *   tools    — AI stack systematisation, automation depth, vendor independence
 *   team     — adoption breadth, written policy, transparency to clients, training
 *
 * Question text + option labels live in messages/{nl,en,es}.json under
 * `assessment.questions.{id}.*`. This file is the structural SSoT: id,
 * category, type, weight, and the points each option contributes.
 *
 * Weight = 2 for two critical AI Act / GDPR items (q4 + q15). Everything
 * else weight = 1. See scoring.ts for how weights combine into per-category
 * percentages.
 */

import type { AssessmentQuestion } from './types'

export const ASSESSMENT_QUESTIONS: readonly AssessmentQuestion[] = [
  // ── Strategy & Visie ─────────────────────────────────────────────────
  {
    id: 'q1',
    category: 'strategy',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q2',
    category: 'strategy',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q3',
    category: 'strategy',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q4',
    category: 'strategy',
    type: 'likert',
    weight: 2,
  },
  // ── Data & Inzichten ────────────────────────────────────────────────
  {
    id: 'q5',
    category: 'data',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q6',
    category: 'data',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q7',
    category: 'data',
    type: 'likert',
    weight: 1,
  },
  {
    id: 'q8',
    category: 'data',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  // ── Tools & Workflows ───────────────────────────────────────────────
  {
    id: 'q9',
    category: 'tools',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q10',
    category: 'tools',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q11',
    category: 'tools',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q12',
    category: 'tools',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  // ── Team & Governance ──────────────────────────────────────────────
  {
    id: 'q13',
    category: 'team',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q14',
    category: 'team',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
  {
    id: 'q15',
    category: 'team',
    type: 'likert',
    weight: 2,
  },
  {
    id: 'q16',
    category: 'team',
    type: 'single',
    weight: 1,
    options: [
      { key: 'a', points: 0 },
      { key: 'b', points: 2 },
      { key: 'c', points: 3 },
      { key: 'd', points: 4 },
    ],
  },
] as const

/** Per-category max-points lookup, derived once for normalisation. */
export const CATEGORY_MAX_POINTS: Record<
  'strategy' | 'data' | 'tools' | 'team',
  number
> = ASSESSMENT_QUESTIONS.reduce(
  (acc, q) => {
    acc[q.category] += 4 * q.weight
    return acc
  },
  { strategy: 0, data: 0, tools: 0, team: 0 },
)

export const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length

export function getQuestionsByCategory(
  category: 'strategy' | 'data' | 'tools' | 'team',
): readonly AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter((q) => q.category === category)
}
