import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useChatbotStore } from '../../../stores/chatbotStore'
import { DEMO_SCENARIOS, BOOKING_STEP } from './scenarios'
import { DemoScenarioCard } from './DemoScenarioCard'
import { DemoCheckpoint } from './DemoCheckpoint'
import { DemoCompletionCard } from './DemoCompletionCard'

interface DemoOrchestratorProps {
  chatStatus: string
  messageCount: number
  onSendMessage: (text: string) => void
}

// Short delay before sending the scripted message (simulates typing)
const TYPING_DELAY_FIRST = 800
const TYPING_DELAY = 1200

export function DemoOrchestrator({
  chatStatus,
  messageCount,
  onSendMessage,
}: DemoOrchestratorProps) {
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
  const messageCountAtSendRef = useRef(0)
  const scenario = DEMO_SCENARIOS.find((s) => s.id === demoScenarioId)
  const currentStep = scenario?.steps[demoStepIndex]

  // Chat is considered "idle" when ready or after error (AI finished or failed)
  const chatIdle = chatStatus === 'ready' || chatStatus === 'error'

  // Send the next scripted message when status is 'running' and chat is idle
  useEffect(() => {
    if (demoStatus !== 'running' || !currentStep || !chatIdle || hasSentRef.current) {
      return
    }

    hasSentRef.current = true
    messageCountAtSendRef.current = messageCount

    const typingDelay = demoStepIndex === 0 ? TYPING_DELAY_FIRST : TYPING_DELAY

    const timer = setTimeout(() => {
      onSendMessage(currentStep.userMessage)
    }, typingDelay)

    return () => clearTimeout(timer)
  }, [demoStatus, demoStepIndex, chatIdle, currentStep, onSendMessage, messageCount])

  // After AI responds, pause and show a continue button.
  // Detection: messageCount increased since we sent the scripted message AND chat is idle.
  // This is more reliable than tracking chatStatus transitions which React can batch.
  useEffect(() => {
    if (
      demoStatus !== 'running' ||
      !hasSentRef.current ||
      !chatIdle ||
      messageCount <= messageCountAtSendRef.current
    ) {
      return
    }

    if (!currentStep) {
      return
    }

    // If this was the last step, mark completed
    if (scenario && demoStepIndex >= scenario.steps.length - 1) {
      setDemoStatus('completed')
      return
    }

    // If step has checkpoint, show checkpoint UI
    if (currentStep.checkpoint) {
      setDemoStatus('checkpoint')
      return
    }

    // Otherwise show "Continue" button — user drives the pace
    setDemoStatus('awaiting-continue')
  }, [chatIdle, messageCount, demoStatus, currentStep, scenario, demoStepIndex, setDemoStatus])

  // Note: hasSentRef is manually reset in handleContinue, handleCheckpoint,
  // and handleScenarioSelect. A useEffect reset on demoStepIndex was removed
  // because it created a race condition: the reset effect ran AFTER the main
  // sendMessage effect, undoing the hasSentRef=true set during message scheduling.

  const handleScenarioSelect = useCallback(
    (id: string) => {
      hasSentRef.current = false
      selectScenario(id)
    },
    [selectScenario]
  )

  const closeSidePanel = useChatbotStore((s) => s.closeSidePanel)

  // User clicks "Continue" to advance to next step
  const handleContinue = useCallback(() => {
    hasSentRef.current = false
    closeSidePanel()
    advanceStep()
  }, [advanceStep, closeSidePanel])

  const handleCheckpoint = useCallback(
    (action: 'next' | 'skip-to-booking' | 'end' | 'next-scenario') => {
      hasSentRef.current = false
      closeSidePanel()

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
    [advanceStep, onSendMessage, setDemoStatus, endDemo, closeSidePanel]
  )

  const handleCompletionBookCall = useCallback(() => {
    hasSentRef.current = false
    onSendMessage(BOOKING_STEP.userMessage)
  }, [onSendMessage])

  if (!demoMode) {
    return null
  }

  // Preview of next step for the continue button
  const nextStep = scenario?.steps[demoStepIndex + 1]

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

      {/* Continue button — user drives the pace */}
      {demoStatus === 'awaiting-continue' && nextStep && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="border-t border-border-primary px-4 py-3"
        >
          <button
            type="button"
            onClick={handleContinue}
            className="flex w-full items-center justify-between rounded-xl border border-accent-system/20 bg-accent-system/5 px-4 py-3 text-left transition-colors hover:bg-accent-system/10 hover:border-accent-system/40 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="h-4 w-4 shrink-0 text-accent-system" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">Continue demo</p>
                <p className="text-[10px] text-text-secondary truncate">
                  Step {demoStepIndex + 2} of {scenario?.stepCount}
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-accent-system transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
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
