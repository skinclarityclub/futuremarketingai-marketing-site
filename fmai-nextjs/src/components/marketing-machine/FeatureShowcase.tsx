import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { GlassCard } from '@/components/ui/GlassCard'

interface Feature {
  title: string
  description: string
  icon: string
}

interface FeatureShowcaseProps {
  features: Feature[]
}

/**
 * 6-module AI feature showcase with visual hierarchy.
 * First card (orchestrator) spans 2 columns on lg for emphasis.
 * Server component — no 'use client' needed.
 */
export function FeatureShowcase({ features }: FeatureShowcaseProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const isHighlighted = index === features.length - 1 // orchestrator is last

        return (
          <ScrollReveal key={feature.title} delay={index * 0.1}>
            <GlassCard
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-accent-system/40 h-full ${
                isHighlighted ? 'lg:col-span-1 border-accent-system/30 bg-accent-system/[0.03]' : ''
              }`}
              highlighted={isHighlighted}
            >
              <div className="space-y-3">
                <span className="text-3xl" role="img" aria-label={feature.title}>
                  {feature.icon}
                </span>
                <h3 className="text-lg font-bold font-display text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            </GlassCard>
          </ScrollReveal>
        )
      })}
    </div>
  )
}
