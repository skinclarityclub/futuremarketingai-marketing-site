import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface WorkflowStep {
  icon: LucideIcon
  label: string
  detail?: string
}

interface AnimatedWorkflowProps {
  steps: WorkflowStep[]
}

export default function AnimatedWorkflow({ steps }: AnimatedWorkflowProps) {
  const [activeStep, setActiveStep] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return

    let current = 0
    const interval = setInterval(() => {
      setActiveStep(current)
      current++
      if (current >= steps.length) {
        clearInterval(interval)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [isInView, steps.length])

  const activeClasses =
    'border-accent-system/40 bg-accent-system/10 shadow-glow-sm text-accent-system'
  const inactiveClasses =
    'border-border-primary bg-bg-surface/50 text-text-muted'

  return (
    <div ref={containerRef}>
      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-center gap-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isActive = i <= activeStep

          return (
            <div key={i} className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  isInView
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.8, opacity: 0 }
                }
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition-colors duration-300 ${
                  isActive ? activeClasses : inactiveClasses
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {step.label}
                </span>
                {step.detail && (
                  <span className="text-xs text-text-muted text-center">
                    {step.detail}
                  </span>
                )}
              </motion.div>

              {i < steps.length - 1 && (
                <ArrowRight
                  className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                    i < activeStep ? 'text-accent-system' : 'text-text-muted'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col items-stretch gap-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isActive = i <= activeStep

          return (
            <div key={i} className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  isInView
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.8, opacity: 0 }
                }
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className={`rounded-xl border p-4 flex items-center gap-3 w-full transition-colors duration-300 ${
                  isActive ? activeClasses : inactiveClasses
                }`}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{step.label}</span>
                  {step.detail && (
                    <span className="text-xs text-text-muted">
                      {step.detail}
                    </span>
                  )}
                </div>
              </motion.div>

              {i < steps.length - 1 && (
                <ArrowDown
                  className={`w-5 h-5 transition-colors duration-300 ${
                    i < activeStep ? 'text-accent-system' : 'text-text-muted'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
