import { getTranslations } from 'next-intl/server'
import { Check, X, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CTAButton } from '@/components/ui/CTAButton'
import {
  FOUNDING_SPOTS_TAKEN,
  FOUNDING_SPOTS_TOTAL,
  MAX_PARTNERS_PER_YEAR,
} from '@/lib/constants'

const FIT_KEYS = ['fit1', 'fit2', 'fit3', 'fit4'] as const
const NOT_FIT_KEYS = ['notFit1', 'notFit2', 'notFit3', 'notFit4'] as const

export async function IcpSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.icp' })

  return (
    <section aria-labelledby="icp-heading" className="py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <SectionHeading id="icp-heading">{t('title')}</SectionHeading>
          <p className="mt-4 text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Positive fit — subtle dominant via accent-system border */}
          <GlassCard className="text-left border-accent-system/30">
            <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-status-active/15 text-status-active"
              >
                <Check className="w-3.5 h-3.5" />
              </span>
              {t('fitTitle')}
            </h3>
            <ul className="space-y-4">
              {FIT_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-text-secondary leading-relaxed">
                  <Check aria-hidden className="w-4 h-4 text-status-active mt-[3px] shrink-0" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Anti-fit — neutral */}
          <GlassCard className="text-left">
            <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-text-muted/15 text-text-muted"
              >
                <X className="w-3.5 h-3.5" />
              </span>
              {t('notFitTitle')}
            </h3>
            <ul className="space-y-4">
              {NOT_FIT_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-text-secondary leading-relaxed">
                  <X aria-hidden className="w-4 h-4 text-text-muted mt-[3px] shrink-0" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        {/* Closing block — scarcity callout + stronger CTA */}
        <div className="mt-12 rounded-2xl border border-accent-human/30 bg-gradient-to-br from-accent-human/[0.05] via-transparent to-transparent p-6 md:p-8 lg:p-10 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-accent-human mb-4">
            {t('scarcityCallout', {
              taken: FOUNDING_SPOTS_TAKEN,
              total: FOUNDING_SPOTS_TOTAL,
              maxPerYear: MAX_PARTNERS_PER_YEAR,
            })}
          </p>
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            {t('closingHeadline')}
          </h3>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto">{t('closingSubtext')}</p>
          <CTAButton
            href="/apply"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {t('closingCta')}
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
