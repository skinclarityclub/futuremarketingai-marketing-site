/**
 * Apply wizard flow state — Zustand store with sessionStorage persistence.
 *
 * Persistence scope: sessionStorage (cleared on tab close).
 * Reasoning: a refresh midden in de flow behoudt answers,
 * but een terugkerende bezoeker een week later moet fresh starten.
 *
 * After successful submission de store wordt gereset zodat een visitor
 * die opnieuw /apply opent niet een stale result-screen ziet.
 *
 * Mirror van src/lib/assessment/store.ts pattern.
 */

'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  WizardStep,
  IdentityFields,
  QualificationAnswers,
  AssessmentHandoff,
  ApplyScoreBreakdown,
  ResultBranch,
} from './types'

interface ApplyWizardState {
  step: WizardStep
  identity: IdentityFields
  qualification: QualificationAnswers
  assessment: AssessmentHandoff | null
  problem: string
  scanCheckChoice: 'yes' | 'no' | null
  result: {
    branch: ResultBranch
    calendlyUrl?: string
    score?: ApplyScoreBreakdown
  } | null
  startedAt: string | null

  // Actions
  start: () => void
  setIdentity: (fields: Partial<IdentityFields>) => void
  setQualification: (answers: Partial<QualificationAnswers>) => void
  setAssessment: (handoff: AssessmentHandoff | null) => void
  setProblem: (text: string) => void
  setScanCheckChoice: (choice: 'yes' | 'no' | null) => void
  goToStep: (step: WizardStep) => void
  next: () => void
  prev: () => void
  setResult: (result: ApplyWizardState['result']) => void
  reset: () => void
}

const STORAGE_KEY = 'fmai-apply-wizard-v1'

const EMPTY_IDENTITY: IdentityFields = { name: '', email: '', agency: '', role: '' }

/**
 * Linear forward flow. Branches depending on scan-check choice:
 *   identity -> scanCheck -> (yes: scanSummary | no: qualification) -> problem -> submitting -> resultX
 */
function nextStep(current: WizardStep, hasScan: boolean): WizardStep {
  switch (current) {
    case 'identity':
      return 'scanCheck'
    case 'scanCheck':
      return hasScan ? 'scanSummary' : 'qualification'
    case 'qualification':
      return 'problem'
    case 'scanSummary':
      return 'problem'
    case 'problem':
      return 'submitting'
    default:
      return current
  }
}

function prevStep(current: WizardStep, hasScan: boolean): WizardStep {
  switch (current) {
    case 'scanCheck':
      return 'identity'
    case 'qualification':
      return 'scanCheck'
    case 'scanSummary':
      return 'scanCheck'
    case 'problem':
      return hasScan ? 'scanSummary' : 'qualification'
    default:
      return current
  }
}

export const useApplyWizard = create<ApplyWizardState>()(
  persist(
    (set, get) => ({
      step: 'identity',
      identity: EMPTY_IDENTITY,
      qualification: {},
      assessment: null,
      problem: '',
      scanCheckChoice: null,
      result: null,
      startedAt: null,

      start: () =>
        set((s) => ({
          step: s.step === 'identity' ? 'identity' : s.step,
          startedAt: s.startedAt ?? new Date().toISOString(),
        })),

      setIdentity: (fields) =>
        set((s) => ({ identity: { ...s.identity, ...fields } })),

      setQualification: (answers) =>
        set((s) => ({ qualification: { ...s.qualification, ...answers } })),

      setAssessment: (handoff) => set({ assessment: handoff }),

      setProblem: (text) => set({ problem: text }),

      setScanCheckChoice: (choice) => set({ scanCheckChoice: choice }),

      goToStep: (step) => set({ step }),

      next: () => {
        const { step, assessment } = get()
        set({ step: nextStep(step, assessment !== null) })
      },

      prev: () => {
        const { step, assessment } = get()
        set({ step: prevStep(step, assessment !== null) })
      },

      setResult: (result) => set({ result }),

      reset: () =>
        set({
          step: 'identity',
          identity: EMPTY_IDENTITY,
          qualification: {},
          assessment: null,
          problem: '',
          scanCheckChoice: null,
          result: null,
          startedAt: null,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? noopStorage : window.sessionStorage,
      ),
      // result is recomputed server-side; do not persist client-side result.
      partialize: (state) => ({
        step: state.step,
        identity: state.identity,
        qualification: state.qualification,
        assessment: state.assessment,
        problem: state.problem,
        scanCheckChoice: state.scanCheckChoice,
        startedAt: state.startedAt,
      }),
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
