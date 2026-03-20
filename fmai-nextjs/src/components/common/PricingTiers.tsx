import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { CTAButton } from '@/components/ui/CTAButton'

interface PricingTier {
  name: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
  badge?: string
}

interface PricingTiersProps {
  tiers: PricingTier[]
  ctaHref?: string
  ctaLabel?: string
}

export function PricingTiers({
  tiers,
  ctaHref = '/contact',
  ctaLabel = 'Get Started',
}: PricingTiersProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {tiers.map((tier, index) => (
        <ScrollReveal key={tier.name} delay={index * 0.1}>
          <div
            className={`relative bg-bg-elevated/50 rounded-xl p-8 flex flex-col h-full ${
              tier.highlighted
                ? 'border border-accent-system ring-1 ring-accent-system/30'
                : 'border border-border-primary'
            }`}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-system text-bg-deep text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                {tier.badge}
              </span>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-text-primary">{tier.name}</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold text-accent-system">{tier.price}</span>
                <span className="text-text-muted ml-1">{tier.period}</span>
              </div>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                  <svg
                    className="w-4 h-4 text-accent-success mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <CTAButton
              href={ctaHref}
              variant={tier.highlighted ? 'primary' : 'secondary'}
              className="w-full"
            >
              {ctaLabel}
            </CTAButton>
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}
