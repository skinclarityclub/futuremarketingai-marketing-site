import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, ProgressIndicator } from '../common'
import { usePrefersReducedMotion } from '../../hooks'
import type { ChannelsCount } from '../../utils/icpScoring'

/**
 * CalculatorWizard - Progressive disclosure wizard for ROI calculator
 *
 * Transforms single-page form into 3-step wizard:
 * - Step 1: Quick Profile (30s) - Industry, team size, primary goal
 * - Step 2: Current Reality (45s) - Channels, spend, campaigns
 * - Step 3: Your Goals (30s) - Goals, advanced settings
 *
 * Features:
 * - Step state management
 * - Progress indication
 * - Smooth transitions
 * - Auto-advance on selection
 * - Mobile responsive
 */

export interface WizardStep {
  id: number
  title: string
  subtitle: string
  icon: string
}

export interface WizardInputs {
  // Step 1: Quick Profile
  industry?: string
  teamSize: number
  companySize?: 'solo' | 'small' | 'growing' | 'enterprise'
  primaryGoal?: 'leads' | 'time' | 'scale' | 'costs'

  // Step 2: Current Reality
  channels: ChannelsCount
  marketingSpend: number
  campaignsPerMonth: number

  // Step 3: Advanced
  avgSalary: number

  // Step 4: Ad Efficiency (ROAS)
  monthlyAdBudget?: number
  testingLevel?: number // 0-100: none → basic → AI-powered
}

export interface CalculatorWizardProps {
  inputs: WizardInputs
  onInputChange: (key: keyof WizardInputs, value: any) => void
  onComplete?: () => void
  renderStep?: (
    step: number,
    inputs: WizardInputs,
    onInputChange: (key: keyof WizardInputs, value: any) => void
  ) => React.ReactNode
  children?: React.ReactNode
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Quick Profile',
    subtitle: 'Tell us about your business',
    icon: '🎯',
  },
  {
    id: 2,
    title: 'Current Reality',
    subtitle: 'Your marketing today',
    icon: '📊',
  },
  {
    id: 3,
    title: 'Your Goals',
    subtitle: 'What you want to achieve',
    icon: '🚀',
  },
  {
    id: 4,
    title: 'Ad Efficiency',
    subtitle: 'Test first, then scale',
    icon: '💎',
  },
]

/**
 * CalculatorWizard Component
 *
 * Main orchestrator for the wizard flow. Manages:
 * - Current step state
 * - Navigation between steps
 * - Progress indication
 * - Step completion validation
 */
export const CalculatorWizard: React.FC<CalculatorWizardProps> = ({
  inputs,
  onInputChange,
  onComplete,
  renderStep,
  children,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Ref for focus management - focus heading when step changes
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)

  // Focus management: Move focus to step heading when step changes (WCAG 2.4.3)
  useEffect(() => {
    // Delay to allow animations to complete before focusing
    const delay = prefersReducedMotion ? 0 : 300
    const timeoutId = setTimeout(() => {
      stepHeadingRef.current?.focus()
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [currentStep, prefersReducedMotion])

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (currentStep < WIZARD_STEPS.length) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      setCurrentStep((prev) => prev + 1)
    } else if (onComplete) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      onComplete()
    }
  }, [currentStep, onComplete])

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const goToStep = useCallback(
    (step: number) => {
      // Only allow going to completed steps or next uncompleted step
      if (step <= WIZARD_STEPS.length && (completedSteps.has(step - 1) || step === currentStep)) {
        setCurrentStep(step)
      }
    },
    [completedSteps, currentStep]
  )

  // Step validation
  const isStepComplete = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          // Step 1: Require team size (others are optional for progressive profiling)
          return inputs.teamSize > 0
        case 2:
          // Step 2: Require channels and campaigns
          return inputs.channels !== undefined && inputs.campaignsPerMonth > 0
        case 3:
          // Step 3: All inputs filled (advanced settings optional)
          return true
        case 4:
          // Step 4: Ad Efficiency is completely optional - always allow to proceed/calculate
          return true
        default:
          return false
      }
    },
    [inputs]
  )

  const canProceed = isStepComplete(currentStep)
  const progress = (currentStep / WIZARD_STEPS.length) * 100

  // Step transition animations - Reduced motion aware
  const stepVariants = {
    enter: (direction: number) =>
      prefersReducedMotion
        ? { x: 0, opacity: 1 }
        : {
            x: direction > 0 ? 300 : -300,
            opacity: 0,
          },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) =>
      prefersReducedMotion
        ? { x: 0, opacity: 1 }
        : {
            x: direction < 0 ? 300 : -300,
            opacity: 0,
          },
  }

  return (
    <div
      className="calculator-wizard"
      role="region"
      aria-label="ROI Calculator Wizard"
      aria-describedby="wizard-description"
    >
      {/* Hidden description for screen readers */}
      <div id="wizard-description" className="sr-only">
        A 3-step wizard to calculate your marketing ROI. Use arrow keys to navigate between steps,
        Enter to proceed, and Backspace to go back.
      </div>

      {/* Progress Indicator */}
      <div className="mb-8" role="navigation" aria-label="Wizard progress">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              ref={stepHeadingRef}
              id={`step-${currentStep}-title`}
              tabIndex={-1}
              className="text-xl md:text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:ring-offset-2 focus:ring-offset-bg-card rounded-lg px-2 -mx-2"
            >
              {WIZARD_STEPS[currentStep - 1].icon} {WIZARD_STEPS[currentStep - 1].title}
            </h2>
            <p className="text-sm text-white/70 mt-1">{WIZARD_STEPS[currentStep - 1].subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-accent-primary">
              Step {currentStep} of {WIZARD_STEPS.length}
            </div>
            <div className="text-xs text-white/60 mt-1">
              ~
              {currentStep === 1
                ? '30'
                : currentStep === 2
                  ? '45'
                  : currentStep === 3
                    ? '30'
                    : '45'}{' '}
              seconds
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressIndicator
          value={progress}
          color="primary"
          showLabel={false}
          className="h-2"
          aria-label={`Wizard progress: ${Math.round(progress)}% complete`}
        />

        {/* Step Indicators */}
        <div className="flex items-center justify-between mt-4">
          {WIZARD_STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              disabled={!completedSteps.has(step.id - 1) && step.id !== currentStep}
              aria-label={`${step.title}: ${
                step.id === currentStep
                  ? 'Current step'
                  : completedSteps.has(step.id)
                    ? 'Completed, click to review'
                    : 'Not yet available'
              }`}
              aria-current={step.id === currentStep ? 'step' : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                step.id === currentStep
                  ? 'bg-accent-primary/20 text-accent-primary border-2 border-accent-primary'
                  : completedSteps.has(step.id)
                    ? 'bg-success/20 text-success border border-success/40 cursor-pointer hover:bg-success/30'
                    : 'bg-white/5 text-white/40 border border-white/10 cursor-not-allowed'
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              <span className="text-xs font-medium hidden sm:inline">{step.title}</span>
              {completedSteps.has(step.id) && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={1}>
        <motion.div
          key={currentStep}
          custom={1}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }
          }
          role="group"
          aria-labelledby={`step-${currentStep}-title`}
        >
          {/* Live region for screen reader announcements */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            Step {currentStep} of {WIZARD_STEPS.length}: {WIZARD_STEPS[currentStep - 1].title}.{' '}
            {WIZARD_STEPS[currentStep - 1].subtitle}.
          </div>

          <GlassCard className="p-6 md:p-8 mb-6">
            {/* Step content rendered dynamically or via children */}
            {renderStep ? renderStep(currentStep, inputs, onInputChange) : children}
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
          aria-label="Go to previous step"
          className={`px-6 py-3 rounded-xl font-medium transition-all min-h-[44px] ${
            currentStep === 1
              ? 'bg-white/5 text-white/40 cursor-not-allowed'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          }`}
        >
          <span aria-hidden="true">←</span> Previous
        </button>

        <button
          onClick={goToNextStep}
          disabled={!canProceed}
          aria-label={
            currentStep === WIZARD_STEPS.length ? 'Calculate your ROI' : 'Go to next step'
          }
          aria-disabled={!canProceed}
          className={`px-8 py-3 rounded-xl font-bold transition-all min-h-[44px] ${
            canProceed
              ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:scale-105 hover:shadow-lg hover:shadow-accent-primary/30'
              : 'bg-white/5 text-white/40 cursor-not-allowed'
          }`}
        >
          {currentStep === WIZARD_STEPS.length ? 'Calculate ROI' : 'Next'}{' '}
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Mobile Helper Text */}
      <div className="mt-4 text-center text-xs text-white/60 md:hidden">
        Swipe or tap buttons to navigate
      </div>
    </div>
  )
}

export default CalculatorWizard
