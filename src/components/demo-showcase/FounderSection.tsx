import { motion } from 'framer-motion'
import { User, Clock, Zap, TrendingUp, type LucideIcon } from 'lucide-react'

interface PilotMetric {
  icon: LucideIcon
  value: string
  label: string
}

const pilotMetrics: PilotMetric[] = [
  { icon: Clock, value: '240+ uur', label: 'Geautomatiseerd per maand' },
  { icon: Zap, value: '14 dagen', label: 'Van start tot live' },
  { icon: TrendingUp, value: '3x', label: 'Meer output, minder werk' },
]

export function FounderSection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-card border border-border-primary bg-bg-surface/60 p-8 md:p-10 backdrop-blur-md"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left — Avatar */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div className="h-24 w-24 rounded-full border-2 border-accent-system/30 bg-bg-elevated flex items-center justify-center">
                <User className="h-10 w-10 text-text-secondary" />
              </div>
            </div>

            {/* Right — Content */}
            <div className="flex-1 space-y-6">
              <h3 className="font-display text-2xl font-bold text-text-primary">
                Gebouwd door een specialist, niet door een team
              </h3>

              <div className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Ik ben de oprichter van FMai. Elke oplossing die ik lever, bouw ik persoonlijk.
                  Geen account managers, geen handoffs, geen miscommunicatie. U werkt direct met de
                  persoon die uw systeem ontwerpt en implementeert.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Voordat ik dit aan klanten aanbood, heb ik alles eerst op mijn eigen bedrijf
                  gebouwd en getest. Dit zijn de resultaten:
                </p>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {pilotMetrics.map((metric, index) => {
                  const Icon = metric.icon
                  return (
                    <motion.div
                      key={metric.label}
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: 'easeOut',
                      }}
                      className="rounded-xl border border-border-primary bg-bg-elevated/60 p-4 text-center"
                    >
                      <Icon className="mx-auto mb-2 h-5 w-5 text-accent-system" />
                      <div className="font-mono text-xl font-bold text-text-primary">
                        {metric.value}
                      </div>
                      <div className="text-xs text-text-secondary">{metric.label}</div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Implementation promise */}
              <div className="rounded-xl border border-accent-system/20 bg-accent-system/5 p-4 text-center">
                <p className="font-medium text-accent-system">
                  Live binnen 14 dagen — of u betaalt niet.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
