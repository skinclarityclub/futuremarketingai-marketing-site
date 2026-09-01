import { getTranslations } from 'next-intl/server'
import { Building2, ScanLine, Brain, Wrench, ShieldCheck, Send } from 'lucide-react'

/**
 * De keten van merk naar gepubliceerde post, in één beeld.
 *
 * De audit van 2026-09-01 vatte de hoofdklacht zo samen: de site beschrijft het
 * systeem maar toont het nergens. De vijf stappen op deze pagina vertellen WAT
 * er per week gebeurt; wat ontbrak is hoe die stappen aan elkaar hangen — waar
 * het merkgeheugen zit, en waar de mens ertussen staat.
 *
 * Bewust GEEN tweede cyclusdiagram: ImprovementLoopCycle verderop op deze pagina
 * toont al de lus productie → goedkeuring → geheugen → verbetering. Deze plaat
 * is de LINEAIRE keten die daarin uitmondt, en stopt precies waar die lus begint.
 *
 * Opgebouwd uit flex-boxen en geen SVG: tekst moet kunnen aflopen, de plaat moet
 * op een telefoon stapelen, en een schermlezer moet er een lijst in horen. Een
 * viewBox met vaste tekstposities kan dat geen van drieën.
 */
const STEPS = [
  { key: 'brand', Icon: Building2 },
  { key: 'scan', Icon: ScanLine },
  { key: 'clyde', Icon: Brain, accent: true },
  { key: 'skills', Icon: Wrench },
  { key: 'approval', Icon: ShieldCheck, human: true },
  { key: 'publish', Icon: Send },
] as const

export async function SystemFlow({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'how-it-works.systemFlow' })

  return (
    <section aria-labelledby="system-flow" className="py-16 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            id="system-flow"
            className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-tight"
          >
            {t('title')}
          </h2>
          <p className="mt-3 text-text-secondary leading-relaxed">{t('subtitle')}</p>
        </div>

        <ol className="mt-10 flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0">
          {STEPS.map(({ key, Icon, ...flags }, i) => {
            const accent = 'accent' in flags && flags.accent
            const human = 'human' in flags && flags.human
            const tone = human
              ? 'border-accent-human/45 bg-accent-human/[0.06]'
              : accent
                ? 'border-accent-system/45 bg-accent-system/[0.06]'
                : 'border-border-primary bg-white/[0.02]'
            const iconTone = human
              ? 'text-accent-human'
              : accent
                ? 'text-accent-system'
                : 'text-text-muted'
            return (
              <li key={key} className="flex flex-col md:flex-1 md:flex-row items-stretch gap-2 md:gap-0">
                <div
                  className={`flex-1 rounded-[var(--radius-card)] border p-4 md:px-3 md:py-5 text-left md:text-center ${tone}`}
                >
                  <Icon
                    className={`w-5 h-5 mb-2 md:mx-auto shrink-0 ${iconTone}`}
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-semibold text-text-primary leading-snug">
                    {t(`steps.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                    {t(`steps.${key}.body`)}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="shrink-0 self-center rotate-90 md:rotate-0 py-1 md:py-0 md:px-2 text-text-muted/50"
                    aria-hidden="true"
                  >
                    →
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        {/* De terugkoppeling. Zonder deze regel leest de plaat als een lopende
            band die één kant op gaat, en dat is precies het misverstand dat het
            geheugen-verhaal moet wegnemen. */}
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-text-muted">
          <span aria-hidden="true" className="text-accent-human">
            ↩
          </span>
          {t('feedback')}
        </p>
      </div>
    </section>
  )
}
