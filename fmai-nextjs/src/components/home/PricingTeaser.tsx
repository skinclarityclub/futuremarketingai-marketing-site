import { getTranslations } from 'next-intl/server'
import { ArrowRight, Crown } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { TIER_PRICING, formatEur } from '@/lib/pricing-data'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'

type TierViewModel = {
  key: 'founding' | 'growth' | 'professional' | 'enterprise'
  price: string
  unit: 'perMonth' | 'perWorkspace'
  highlighted: boolean
}

export async function PricingTeaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.pricingTeaser' })

  const founding = TIER_PRICING.FOUNDING_MEMBER
  const growth = TIER_PRICING.GROWTH
  const professional = TIER_PRICING.PROFESSIONAL
  const enterprise = TIER_PRICING.ENTERPRISE

  const tiers: TierViewModel[] = [
    {
      key: 'founding',
      price: formatEur(founding.pricingModel === 'fixed' ? founding.price : 0, locale),
      unit: 'perMonth',
      highlighted: true,
    },
    {
      key: 'growth',
      price: formatEur(growth.pricingModel === 'workspace' ? growth.pricePerWorkspace : 0, locale),
      unit: 'perWorkspace',
      highlighted: false,
    },
    {
      key: 'professional',
      price: formatEur(professional.pricingModel === 'workspace' ? professional.pricePerWorkspace : 0, locale),
      unit: 'perWorkspace',
      highlighted: false,
    },
    {
      key: 'enterprise',
      price: formatEur(enterprise.pricingModel === 'workspace' ? enterprise.pricePerWorkspace : 0, locale),
      unit: 'perWorkspace',
      highlighted: false,
    },
  ]

  return (
    <section
      aria-labelledby="pricing-teaser"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 lg:mb-12">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-3">
            {t('eyebrow')}
          </p>
          <h2
            id="pricing-teaser"
            className="font-display text-3xl md:text-4xl font-bold text-text-primary max-w-3xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-text-secondary max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className={
                tier.highlighted
                  ? 'relative rounded-2xl border border-accent-human/40 bg-gradient-to-b from-accent-human/[0.08] to-transparent p-6 flex flex-col'
                  : 'relative rounded-2xl border border-border-primary bg-white/[0.02] p-6 flex flex-col transition-colors hover:bg-white/[0.04]'
              }
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-accent-human/15 border border-accent-human/40 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-accent-human">
                  <Crown className="w-3 h-3" aria-hidden />
                  {t(`tiers.${tier.key}.tagline`)}
                </span>
              )}

              <div className="mb-1">
                <span className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  {t(`tiers.${tier.key}.label`)}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-3xl lg:text-4xl font-bold text-text-primary">
                  €{tier.price}
                </span>
              </div>
              <p className="text-xs text-text-muted mb-4">
                {t(tier.unit)}
              </p>

              {!tier.highlighted && (
                <p className="text-xs text-text-secondary font-medium mb-3">
                  {t(`tiers.${tier.key}.tagline`)}
                </p>
              )}

              <p className="text-sm text-text-secondary leading-relaxed flex-1">
                {t(`tiers.${tier.key}.desc`)}
              </p>

              {tier.highlighted && (
                <p className="mt-4 text-xs font-mono uppercase tracking-[0.14em] text-accent-human">
                  {t('spotsTaken', {
                    taken: FOUNDING_SPOTS_TAKEN,
                    total: FOUNDING_SPOTS_TOTAL,
                  })}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
          >
            {t('ctaLink')}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
