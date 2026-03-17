import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import BeforeAfter from './BeforeAfter'
import AnimatedWorkflow from './AnimatedWorkflow'
import { automationUseCases } from './automation-data'

export default function AutomationShowcase() {
  return (
    <section id="automations" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-system/10">
            <Zap className="h-5 w-5 text-accent-system" />
          </div>
          <h2 className="font-display text-3xl font-bold text-text-primary">AI Automations</h2>
          <p className="mt-2 text-text-secondary">
            De meest gevraagde automations die direct tijd en geld besparen.
          </p>
        </motion.div>

        {/* Use cases */}
        <div className="space-y-20">
          {automationUseCases.map((useCase) => (
            <motion.div
              key={useCase.id}
              id={useCase.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  {useCase.title}
                </h3>
                <span className="rounded-full bg-accent-system/10 px-3 py-1 font-mono text-sm text-accent-system">
                  {useCase.outcomeMetric}
                </span>
              </div>

              <BeforeAfter before={useCase.before} after={useCase.after} />

              <div className="mt-6">
                <p className="mb-2 text-center text-xs uppercase tracking-wider text-text-muted">
                  How it works
                </p>
                <AnimatedWorkflow steps={useCase.workflow} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
