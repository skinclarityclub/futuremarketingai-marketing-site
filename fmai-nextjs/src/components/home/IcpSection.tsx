import { getTranslations } from 'next-intl/server'
import { Check, X, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CTAButton } from '@/components/ui/CTAButton'

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

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Positive fit */}
          <GlassCard className="text-left">
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

          {/* Anti-fit */}
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

        {/* Closing CTA row */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-text-secondary">{t('closingPrompt')}</p>
          <CTAButton
            href="/apply"
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {t('closingCta')}
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
