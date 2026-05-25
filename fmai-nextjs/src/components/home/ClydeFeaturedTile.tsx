import { getTranslations } from 'next-intl/server'
import { ArrowRight, Bot } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export async function ClydeFeaturedTile({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.services.clyde' })

  // Static prompt in W2 (W3/W5 add typewriter rotation).
  const prompt = t('prompt1')

  return (
    <Link
      href="/skills/clyde"
      aria-labelledby="clyde-featured"
      className="group relative rounded-[var(--radius-card)] border border-accent-system/40 bg-gradient-to-br from-accent-system/[0.08] via-bg-surface/40 to-transparent p-6 lg:p-8 flex flex-col gap-5 transition-all duration-300 hover:bg-accent-system/[0.04] hover:border-accent-system/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
    >
      {/* Status pulse + Clyde header */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid place-items-center w-9 h-9 rounded-xl bg-accent-system/15 text-accent-system"
          >
            <Bot className="w-5 h-5" />
          </span>
          <div>
            <h3
              id="clyde-featured"
              className="font-display text-xl lg:text-2xl font-bold text-text-primary"
            >
              {t('title')}
            </h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-status-active/10 border border-status-active/30 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-status-active">
          <span aria-hidden className="relative inline-flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-status-active animate-ping opacity-75" />
            <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-status-active" />
          </span>
          {t('statusLabel')}
        </span>
      </header>

      {/* Description */}
      <p className="text-sm lg:text-base text-text-secondary leading-relaxed max-w-md">
        {t('description')}
      </p>

      {/* Prompt example (static W2, typewriter W3+) */}
      <div className="mt-auto rounded-xl border border-border-primary/70 bg-bg-deep/40 px-4 py-3">
        <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-text-muted mb-1.5">
          {t('promptIntro')}
        </p>
        <p className="font-mono text-sm text-text-primary leading-snug">
          {prompt}
          <span aria-hidden className="ml-0.5 inline-block w-2 h-4 align-middle bg-accent-system/70 animate-pulse" />
        </p>
      </div>

      {/* Open link footer */}
      <footer>
        <span className="inline-flex items-center gap-1.5 text-sm text-accent-system group-hover:text-text-primary transition-colors">
          {t('openLink')}
          <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </footer>
    </Link>
  )
}
