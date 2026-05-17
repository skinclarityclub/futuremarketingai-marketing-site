/**
 * AI Readiness Assessment — pure scoring + persona derivation.
 *
 * No side effects, no IO. Given the answer map, produces per-category
 * percentages, a total, the derived persona, and the lowest-scoring
 * category (which drives skill recommendations).
 *
 * Math:
 *   - Single-select: option.points (0..4) × question.weight
 *   - Likert (1..5): (response − 1) × question.weight; if invertScore is
 *     set, (5 − response) × question.weight is used instead.
 *   - Category score = sum of points / CATEGORY_MAX_POINTS[cat] × 100,
 *     rounded to nearest integer.
 *   - Missing answers contribute 0 points (defensive; the API also
 *     validates completeness).
 *   - Total = mean of the four category scores, rounded.
 *
 * Persona thresholds (from domain research, calibrate after ~50 completes):
 *   total <  40 → explorer
 *   40 ≤ total < 70 → builder
 *   total ≥ 70 → operator
 */

import { ASSESSMENT_QUESTIONS, CATEGORY_MAX_POINTS } from './questions'
import {
  ASSESSMENT_CATEGORIES,
  type AnswerValue,
  type AssessmentAnswers,
  type AssessmentCategory,
  type AssessmentPersona,
  type AssessmentResult,
  type AssessmentQuestion,
  type CategoryScores,
} from './types'

const EXPLORER_MAX = 39
const BUILDER_MAX = 69

function pointsForQuestion(
  question: AssessmentQuestion,
  answer: AnswerValue | undefined,
): number {
  if (answer === undefined) return 0

  if (question.type === 'single') {
    const option = question.options.find((opt) => opt.key === answer)
    return (option?.points ?? 0) * question.weight
  }

  // Likert: response is 1..5.
  const response = typeof answer === 'number' ? answer : 0
  if (response < 1 || response > 5) return 0
  const raw = question.invertScore ? 5 - response : response - 1
  return raw * question.weight
}

function categoryScore(
  answers: AssessmentAnswers,
  category: AssessmentCategory,
): number {
  const max = CATEGORY_MAX_POINTS[category]
  if (max === 0) return 0
  const sum = ASSESSMENT_QUESTIONS.filter((q) => q.category === category).reduce(
    (acc, q) => acc + pointsForQuestion(q, answers[q.id]),
    0,
  )
  return Math.round((sum / max) * 100)
}

function derivePersona(total: number): AssessmentPersona {
  if (total <= EXPLORER_MAX) return 'explorer'
  if (total <= BUILDER_MAX) return 'builder'
  return 'operator'
}

/**
 * Tie-break in canonical strategy/data/tools/team order, matching the
 * narrative arc shown on the result page.
 */
function findLowestCategory(scores: CategoryScores): AssessmentCategory {
  let lowest: AssessmentCategory = ASSESSMENT_CATEGORIES[0]
  for (const cat of ASSESSMENT_CATEGORIES) {
    if (scores[cat] < scores[lowest]) lowest = cat
  }
  return lowest
}

export function scoreAssessment(answers: AssessmentAnswers): AssessmentResult {
  const perCategory: CategoryScores = {
    strategy: categoryScore(answers, 'strategy'),
    data: categoryScore(answers, 'data'),
    tools: categoryScore(answers, 'tools'),
    team: categoryScore(answers, 'team'),
  }
  const total = Math.round(
    (perCategory.strategy + perCategory.data + perCategory.tools + perCategory.team) / 4,
  )
  return {
    perCategory,
    total,
    persona: derivePersona(total),
    lowestCategory: findLowestCategory(perCategory),
  }
}
