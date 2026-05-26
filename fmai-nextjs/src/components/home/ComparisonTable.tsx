import { getTranslations } from 'next-intl/server'
import { ArrowRight, X, AlertCircle, Check } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { LucideIcon } from 'lucide-react'

type RowKey = 'geheugen' | 'schaalbaar' | 'sovereignty' | 'setup' | 'prijs' | 'lockin'
type Strength = 'weak' | 'mixed' | 'strong'

const ROWS: { key: RowKey; diy: Strength; bureau: Strength; clyde: Strength }[] = [
  { key: 'geheugen',     diy: 'weak',  bureau: 'mixed', clyde: 'strong' },
  { key: 'schaalbaar',   diy: 'weak',  bureau: 'weak',  clyde: 'strong' },
  { key: 'sovereignty',  diy: 'weak',  bureau: 'mixed', clyde: 'strong' },
  { key: 'setup',        diy: 'mixed', bureau: 'weak',  clyde: 'mixed'  },
  { key: 'prijs',        diy: 'mixed', bureau: 'weak',  clyde: 'strong' },
  { key: 'lockin',       diy: 'weak',  bureau: 'weak',  clyde: 'strong' },
]

const STRENGTH_ICON: Record<Strength, LucideIcon> = {
  weak: X,
  mixed: AlertCircle,
  strong: Check,
}

const STRENGTH_DOT: Record<Strength, string> = {
  weak: 'bg-error/70',
  mixed: 'bg-accent-human/70',
  strong: 'bg-status-active/80',
}

const STRENGTH_ICON_COLOR: Record<Strength, string> = {
  weak: 'text-error/80',
  mixed: 'text-accent-human/90',
  strong: 'text-status-active',
}

export async function ComparisonTable({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.comparison' })

  return (
    <section
      aria-labelledby="comparison-table"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 lg:mb-12 max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-3">
            {t('eyebrow')}
          </p>
          <h2
            id="comparison-table"
            className="font-display text-3xl md:text-4xl font-bold text-text-primary"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-text-secondary">
            {t('subtitle')}
          </p>
        </div>

        {/* Mobile: horizontal scroll. Desktop: full grid. */}
        <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0 lg:overflow-visible">
          <table className="min-w-[760px] lg:min-w-full w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="font-mono uppercase text-[11px] tracking-[0.16em] text-text-muted px-4 lg:px-5 py-3 align-bottom"
                >
                  {t('headers.topic')}
                </th>
                <th
                  scope="col"
                  className="font-mono uppercase text-[11px] tracking-[0.16em] text-text-muted px-4 lg:px-5 py-3 align-bottom"
                >
                  <span className="block">{t('headers.diy')}</span>
                  <span className="block normal-case tracking-normal text-text-muted/70 mt-0.5 text-[10px]">
                    {t('headers.diyHint')}
                  </span>
                </th>
                <th
                  scope="col"
                  className="font-mono uppercase text-[11px] tracking-[0.16em] text-text-muted px-4 lg:px-5 py-3 align-bottom"
                >
                  {t('headers.bureau')}
                </th>
                <th
                  scope="col"
                  className="font-mono uppercase text-[11px] tracking-[0.16em] text-accent-system px-4 lg:px-5 py-3 align-bottom bg-accent-system/[0.06] border-x border-t border-accent-system/30 rounded-t-xl"
                >
                  {t('headers.clyde')}
                </th>
              </tr>
            </thead>

            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.key}>
                  <th
                    scope="row"
                    className={
                      'font-semibold text-text-primary px-4 lg:px-5 py-4 align-top' +
                      (i === 0 ? ' border-t border-border-primary' : '') +
                      ' border-b border-border-primary/70'
                    }
                  >
                    {t(`rows.${row.key}.label`)}
                  </th>

                  <ComparisonCell
                    strength={row.diy}
                    text={t(`rows.${row.key}.diy`)}
                    strengthLabel={t(`strengthLabels.${row.diy}`)}
                    borderTop={i === 0}
                  />

                  <ComparisonCell
                    strength={row.bureau}
                    text={t(`rows.${row.key}.bureau`)}
                    strengthLabel={t(`strengthLabels.${row.bureau}`)}
                    borderTop={i === 0}
                  />

                  <td className="px-4 lg:px-5 py-4 align-top bg-accent-system/[0.06] border-x border-b border-accent-system/20">
                    <CellInner
                      strength={row.clyde}
                      text={t(`rows.${row.key}.clyde`)}
                      strengthLabel={t(`strengthLabels.${row.clyde}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <th
                  scope="row"
                  className="font-mono uppercase text-[11px] tracking-[0.16em] text-text-muted px-4 lg:px-5 pt-6 pb-3 align-top"
                >
                  {t('recap.label')}
                </th>
                <td className="px-4 lg:px-5 pt-6 pb-3 align-top text-sm text-text-secondary leading-relaxed">
                  {t('recap.diy')}
                </td>
                <td className="px-4 lg:px-5 pt-6 pb-3 align-top text-sm text-text-secondary leading-relaxed">
                  {t('recap.bureau')}
                </td>
                <td className="px-4 lg:px-5 pt-6 pb-5 align-top text-sm font-semibold text-accent-system leading-relaxed bg-accent-system/[0.06] border-x border-b border-accent-system/30 rounded-b-xl">
                  {t('recap.clyde')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-8">
          <Link
            href="/how-it-works"
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

function ComparisonCell({
  strength,
  text,
  strengthLabel,
  borderTop,
}: {
  strength: Strength
  text: string
  strengthLabel: string
  borderTop: boolean
}) {
  return (
    <td
      className={
        'px-4 lg:px-5 py-4 align-top text-text-secondary' +
        (borderTop ? ' border-t border-border-primary' : '') +
        ' border-b border-border-primary/70'
      }
    >
      <CellInner strength={strength} text={text} strengthLabel={strengthLabel} />
    </td>
  )
}

function CellInner({
  strength,
  text,
  strengthLabel,
}: {
  strength: Strength
  text: string
  strengthLabel: string
}) {
  const Icon = STRENGTH_ICON[strength]
  return (
    <div className="flex items-start gap-2.5">
      <span className="flex items-center gap-1 shrink-0 mt-0.5">
        <span
          aria-hidden
          className={`inline-block w-1.5 h-1.5 rounded-full ${STRENGTH_DOT[strength]}`}
        />
        <Icon
          aria-label={strengthLabel}
          className={`w-3.5 h-3.5 ${STRENGTH_ICON_COLOR[strength]}`}
        />
      </span>
      <span className="text-sm leading-relaxed text-text-secondary">{text}</span>
    </div>
  )
}
