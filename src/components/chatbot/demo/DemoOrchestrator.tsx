import { useEffect, useRef, useCallback } from 'react'
import { useChatbotStore } from '../../../stores/chatbotStore'
import { DEMO_SCENARIOS, BOOKING_STEP } from './scenarios'
import { DemoScenarioCard } from './DemoScenarioCard'
import { DemoCheckpoint } from './DemoCheckpoint'
import { DemoCompletionCard } from './DemoCompletionCard'

interface DemoOrchestratorProps {
  chatStatus: string
  onSendMessage: (text: string) => void
}

export function DemoOrchestrator({ chatStatus, onSendMessage }: DemoOrchestratorProps) {
  const {
    demoMode,
    demoScenarioId,
    demoStepIndex,
    demoStatus,
    demoStartedAt,
    selectScenario,
    advanceStep,
    setDemoStatus,
    endDemo,
  } = useChatbotStore()

  const hasSentRef = useRef(false)
  const scenario = DEMO_SCENARIOS.find((s) => s.id === demoScenarioId)
  const currentStep = scenario?.steps[demoStepIndex]

  // Send the next scripted message when status is 'running' and chat is ready
  useEffect(() => {
    if (demoStatus !== 'running' || !currentStep || chatStatus !== 'ready' || hasSentRef.current) {
      return
    }

    hasSentRef.current = true

    // Small delay for natural pacing
    const timer = setTimeout(() => {
      onSendMessage(currentStep.userMessage)
    }, 500)

    return () => clearTimeout(timer)
  }, [demoStatus, demoStepIndex, chatStatus, currentStep, onSendMessage])

  // After AI responds (status goes back to ready), check for checkpoint
  useEffect(() => {
    if (demoStatus !== 'running' || !hasSentRef.current || chatStatus !== 'ready') {
      return
    }

    // Wait a moment then check if this step has a checkpoint
    const timer = setTimeout(() => {
      if (!currentStep) {
        return
      }

      // If this was the last step, mark completed
      if (scenario && demoStepIndex >= scenario.steps.length - 1) {
        setDemoStatus('completed')
        return
      }

      // If step has checkpoint, pause for user choice
      if (currentStep.checkpoint) {
        setDemoStatus('checkpoint')
        return
      }

      // Otherwise auto-advance
      hasSentRef.current = false
      advanceStep()
    }, 300)

    return () => clearTimeout(timer)
  }, [chatStatus, demoStatus, currentStep, scenario, demoStepIndex, advanceStep, setDemoStatus])

  // Reset sent flag when step changes
  useEffect(() => {
    hasSentRef.current = false
  }, [demoStepIndex])

  const handleScenarioSelect = useCallback(
    (id: string) => {
      hasSentRef.current = false
      selectScenario(id)
    },
    [selectScenario]
  )

  const handleCheckpoint = useCallback(
    (action: 'next' | 'skip-to-booking' | 'end' | 'next-scenario') => {
      hasSentRef.current = false

      switch (action) {
        case 'next':
          advanceStep()
          break
        case 'skip-to-booking':
          onSendMessage(BOOKING_STEP.userMessage)
          setDemoStatus('completed')
          break
        case 'next-scenario':
          setDemoStatus('choosing')
          break
        case 'end':
          endDemo()
          break
      }
    },
    [advanceStep, onSendMessage, setDemoStatus, endDemo]
  )

  const handleCompletionBookCall = useCallback(() => {
    hasSentRef.current = false
    onSendMessage(BOOKING_STEP.userMessage)
  }, [onSendMessage])

  if (!demoMode) {
    return null
  }

  return (
    <>
      {/* Scenario selection */}
      {demoStatus === 'choosing' && (
        <div className="space-y-2 px-1 py-2">
          <p className="text-xs text-text-secondary">Choose a scenario to explore:</p>
          {DEMO_SCENARIOS.map((s, i) => (
            <DemoScenarioCard
              key={s.id}
              id={s.id}
              title={s.title}
              subtitle={s.subtitle}
              icon={s.icon}
              stepCount={s.stepCount}
              index={i}
              onSelect={handleScenarioSelect}
            />
          ))}
        </div>
      )}

      {/* Checkpoint */}
      {demoStatus === 'checkpoint' && currentStep?.checkpoint && (
        <DemoCheckpoint
          prompt={currentStep.checkpoint.prompt}
          options={currentStep.checkpoint.options}
          onSelect={handleCheckpoint}
        />
      )}

      {/* Completion card */}
      {demoStatus === 'completed' && scenario && (
        <DemoCompletionCard
          scenarioTitle={scenario.title}
          durationSeconds={demoStartedAt ? Math.round((Date.now() - demoStartedAt) / 1000) : 0}
          onTryAnother={() => {
            hasSentRef.current = false
            setDemoStatus('choosing')
          }}
          onBookCall={handleCompletionBookCall}
          onEndDemo={endDemo}
        />
      )}
    </>
  )
}
