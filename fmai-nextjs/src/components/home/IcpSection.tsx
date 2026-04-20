import { getTranslations } from 'next-intl/server'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

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
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#00FF88]/15 text-[#00FF88] text-sm"
              >
                ✓
              </span>
              {t('fitTitle')}
            </h3>
            <ul className="space-y-4">
              {FIT_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-text-secondary leading-relaxed">
                  <span aria-hidden className="text-[#00FF88] pt-[2px] shrink-0">
                    ✓
                  </span>
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
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-text-muted/15 text-text-muted text-sm"
              >
                —
              </span>
              {t('notFitTitle')}
            </h3>
            <ul className="space-y-4">
              {NOT_FIT_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-text-secondary leading-relaxed">
                  <span aria-hidden className="text-text-muted pt-[2px] shrink-0">
                    —
                  </span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
