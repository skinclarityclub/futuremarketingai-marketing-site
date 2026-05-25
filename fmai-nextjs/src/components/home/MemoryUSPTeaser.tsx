import { getTranslations } from 'next-intl/server'
import { ArrowRight, Brain, Layers, History, SlidersHorizontal } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { LucideIcon } from 'lucide-react'

type LayerKey = 'context' | 'merken' | 'historie' | 'voorkeuren'

const LAYERS: { key: LayerKey; index: string; Icon: LucideIcon }[] = [
  { key: 'context',    index: '01', Icon: Brain              },
  { key: 'merken',     index: '02', Icon: Layers             },
  { key: 'historie',   index: '03', Icon: History            },
  { key: 'voorkeuren', index: '04', Icon: SlidersHorizontal  },
]

export async function MemoryUSPTeaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.memoryUsp' })

  return (
    <section
      aria-labelledby="memory-usp"
      className="relative py-20 px-6 lg:px-12"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 lg:mb-12 max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-3">
            {t('eyebrow')}
          </p>
          <h2
            id="memory-usp"
            className="font-display text-3xl md:text-4xl font-bold text-text-primary"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-text-secondary">
            {t('intro')}
          </p>
        </div>

        {/*
          4-layer stack. Static in W2 — W5.7 adds sequential scroll-reveal.
          Visual: gradient bg-surface (top) → bg-deep (bottom) suggesting layered depth.
        */}
        <div
          className="relative rounded-[var(--radius-card)] overflow-hidden border border-border-primary bg-gradient-to-b from-bg-surface via-bg-surface/60 to-bg-deep"
        >
          {LAYERS.map(({ key, index, Icon }, i) => (
            <div
              key={key}
              className={
                'relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 px-6 lg:px-8 py-6 lg:py-7' +
                (i > 0 ? ' border-t border-accent-system/20' : '')
              }
            >
              {/* Connector dot — links the layers as a visual through-line */}
              <span
                aria-hidden
                className="absolute left-6 lg:left-8 -top-[5px] hidden sm:block w-2 h-2 rounded-full bg-accent-system/40 ring-2 ring-bg-deep"
              />

              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0 sm:w-32">
                <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-text-muted">
                  {index}
                </span>
                <Icon className="w-5 h-5 text-accent-system" aria-hidden />
                <span className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-accent-system">
                  {t(`layers.${key}.label`)}
                </span>
              </div>

              <p className="text-base text-text-secondary leading-relaxed flex-1 max-w-2xl">
                {t(`layers.${key}.body`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/memory"
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
