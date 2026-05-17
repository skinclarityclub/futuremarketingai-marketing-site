/**
 * Assessment flow state — Zustand store with sessionStorage persistence.
 *
 * Persistence scope: sessionStorage (cleared on tab close).
 * Reasoning: a refresh during the 5-minute flow should preserve answers,
 * but a return-visitor a week later should start fresh rather than resume
 * stale state from a different mental context.
 *
 * After successful submission the store is reset, so a visitor who has
 * confirmed their email and re-opens /assessment in the same tab sees the
 * intro rather than a stale persona reveal.
 */

'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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

const STORAGE_KEY = 'fmai-assessment-v1'

export const useAssessment = create<AssessmentState>()(
  persist(
    (set, get) => ({
      step: 'intro',
      currentIndex: 0,
      answers: {},
      result: null,
      startedAt: null,

      start: () =>
        set({
          step: 'questions',
          currentIndex: 0,
          startedAt: new Date().toISOString(),
        }),

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
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? noopStorage : window.sessionStorage,
      ),
      // result is derived from answers via scoreAssessment; recompute on
      // hydrate rather than persisting a possibly-stale copy.
      partialize: (state) => ({
        step: state.step,
        currentIndex: state.currentIndex,
        answers: state.answers,
        startedAt: state.startedAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        if (state.step === 'result' && Object.keys(state.answers).length > 0) {
          state.result = scoreAssessment(state.answers)
        }
      },
    },
  ),
)

const noopStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
}
