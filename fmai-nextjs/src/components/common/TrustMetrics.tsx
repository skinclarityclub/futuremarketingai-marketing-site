import { ScrollReveal } from '@/components/motion/ScrollReveal'

interface TrustMetric {
  value: string
  label: string
  description?: string
}

interface TrustMetricsProps {
  metrics: TrustMetric[]
}

export function TrustMetrics({ metrics }: TrustMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <ScrollReveal key={metric.label} delay={index * 0.1}>
          <div className="bg-bg-elevated/50 border border-border-primary rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-accent-system">{metric.value}</div>
            <div className="text-lg font-semibold text-text-primary mt-2">{metric.label}</div>
            {metric.description && (
              <div className="text-sm text-text-secondary mt-1">{metric.description}</div>
            )}
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}
