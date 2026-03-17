import { motion } from 'framer-motion'
import { Clock, Rocket, Calendar } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Metric {
  icon: LucideIcon
  value: string
  label: string
}

const metrics: Metric[] = [
  { icon: Clock, value: '240+', label: 'Hours automated' },
  { icon: Rocket, value: '3', label: 'Live implementations' },
  { icon: Calendar, value: '14 days', label: 'Average deployment' },
]

const techStack = ['n8n', 'Claude', 'Vapi', 'Make', 'OpenAI']

export default function SocialProofBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full border-y border-border-primary bg-bg-surface/50"
    >
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Metrics row */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-accent-system" />
                <div className="flex flex-col">
                  <span className="font-mono text-lg font-bold text-text-primary">
                    {metric.value}
                  </span>
                  <span className="text-xs text-text-secondary">{metric.label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tech stack badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs text-text-secondary">Gebouwd met</span>
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border-primary bg-bg-elevated/60 px-3 py-1 font-mono text-xs text-text-primary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
