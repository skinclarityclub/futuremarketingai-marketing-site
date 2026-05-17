/**
 * Assessment flow state — Zustand store, in-memory only.
 *
 * Deliberately not persisted: a refresh restarts the scan. The whole flow is
 * ~5 minutes; the resume-vs-bug tradeoff favours simplicity. If completion
 * data later shows >X% refresh-mid-scan we can add sessionStorage hydration.
 */

'use client'

import { create } from 'zustand'
import { scoreAssessment } from './scoring'
import type {
  AnswerValue,
  AssessmentAnswers,
  AssessmentResult,
  QuestionId,
} from './types'

export type AssessmentStep = 'intro' | 'questions' | 'result' | 'submitted'

interface AssessmentState {
  step: AssessmentStep
  currentIndex: number
  answers: AssessmentAnswers
  result: AssessmentResult | null
  startedAt: string | null

  start: () => void
  setAnswer: (qid: QuestionId, value: AnswerValue) => void
  next: (totalQuestions: number) => void
  prev: () => void
  finalize: () => void
  markSubmitted: () => void
  reset: () => void
}

export const useAssessment = create<AssessmentState>((set, get) => ({
  step: 'intro',
  currentIndex: 0,
  answers: {},
  result: null,
  startedAt: null,

  start: () => set({ step: 'questions', currentIndex: 0, startedAt: new Date().toISOString() }),

  setAnswer: (qid, value) =>
    set((state) => ({ answers: { ...state.answers, [qid]: value } })),

  next: (totalQuestions) => {
    const { currentIndex } = get()
    if (currentIndex + 1 >= totalQuestions) {
      get().finalize()
    } else {
      set({ currentIndex: currentIndex + 1 })
    }
  },

  prev: () =>
    set((state) => ({ currentIndex: Math.max(0, state.currentIndex - 1) })),

  finalize: () => {
    const { answers } = get()
    set({ result: scoreAssessment(answers), step: 'result' })
  },

  markSubmitted: () => set({ step: 'submitted' }),

  reset: () =>
    set({
      step: 'intro',
      currentIndex: 0,
      answers: {},
      result: null,
      startedAt: null,
    }),
}))
