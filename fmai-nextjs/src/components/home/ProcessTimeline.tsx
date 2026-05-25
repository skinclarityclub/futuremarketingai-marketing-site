import { getTranslations } from 'next-intl/server'

const WEEKS = ['1', '2', '3', '4'] as const

export async function ProcessTimeline({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.processTimeline' })

  return (
    <section
      aria-labelledby="process-timeline"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 lg:mb-16 max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-3">
            {t('eyebrow')}
          </p>
          <h2
            id="process-timeline"
            className="font-display text-3xl md:text-4xl font-bold text-text-primary"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-text-secondary">
            {t('subtitle')}
          </p>
        </div>

        {/*
          Horizontal timeline desktop, vertical timeline mobile.
          Static in W2 — W5.4 promotes to GSAP pin-stack scroll.
        */}
        <div className="relative">
          {/* Horizontal connector — desktop only */}
          <span
            aria-hidden
            className="hidden lg:block absolute top-[14px] left-[8px] right-[8px] h-px bg-gradient-to-r from-accent-system/60 via-accent-system/30 to-transparent"
          />

          <ol className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-5 relative">
            {WEEKS.map((week, i) => (
              <li
                key={week}
                className="relative flex lg:flex-col gap-4 lg:gap-0"
              >
                {/* Vertical connector — mobile only */}
                {i < WEEKS.length - 1 && (
                  <span
                    aria-hidden
                    className="lg:hidden absolute left-[7px] top-7 bottom-[-1.5rem] w-px bg-accent-system/30"
                  />
                )}

                {/* Node + index — desktop sits on horizontal line */}
                <div className="flex lg:items-center gap-3 lg:mb-5 shrink-0">
                  <span
                    aria-hidden
                    className="relative grid place-items-center w-4 h-4 lg:w-7 lg:h-7 rounded-full bg-bg-deep border border-accent-system"
                  >
                    <span className="block w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-accent-system" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-system lg:flex-1">
                    {t(`weeks.${week}.label`)}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-lg lg:text-xl font-bold text-text-primary mb-2">
                    {t(`weeks.${week}.heading`)}
                  </h3>
                  <p className="text-sm lg:text-base text-text-secondary leading-relaxed max-w-md">
                    {t(`weeks.${week}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
