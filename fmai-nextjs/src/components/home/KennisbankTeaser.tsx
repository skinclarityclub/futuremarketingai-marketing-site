/**
 * KennisbankTeaser — homepage section that surfaces the /kennisbank knowledge
 * base with strong internal links to the cornerstone pillars + a featured
 * comparison page.
 *
 * Pure Server Component. Copy arrives via props (page owns i18n); the card
 * data (title/description/readTime) comes from the real MDX frontmatter via
 * lib/blog, so titles and snippets never drift from the published pages.
 * Renders nothing when no featured items exist for the locale (graceful
 * degradation — NL has cornerstone content now, EN/ES light up once translated).
 *
 * Visual idiom mirrors the existing homepage sections (mono eyebrow +
 * SectionHeading + border-card grid), not the /kennisbank GlassCard idiom, so
 * the block blends into the already-polished homepage.
 */
import { Link } from '@/i18n/navigation'
import { BookOpen, GitCompareArrows, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CTAButton } from '@/components/ui/CTAButton'

export interface KennisbankCard {
  slug: string
  title: string
  description: string
  readTime: number
  kind: 'pillar' | 'comparison'
}

interface KennisbankTeaserProps {
  eyebrow: string
  title: string
  intro: string
  ctaLabel: string
  /** Badge label for pillar (cornerstone) cards. */
  badgePillar: string
  /** Badge label for the comparison card. */
  badgeComparison: string
  /** Per-card read link label, e.g. "Lees de gids". */
  readLabel: string
  /** Read-time suffix, e.g. "min lezen" — rendered as "{n} min lezen". */
  readTimeLabel: string
  items: KennisbankCard[]
}

export function KennisbankTeaser({
  eyebrow,
  title,
  intro,
  ctaLabel,
  badgePillar,
  badgeComparison,
  readLabel,
  readTimeLabel,
  items,
}: KennisbankTeaserProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="kennisbank" className="py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-4">
            {eyebrow}
          </p>
          <SectionHeading id="kennisbank">{title}</SectionHeading>
          <p className="mt-4 text-base lg:text-lg text-text-secondary leading-relaxed">{intro}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 auto-rows-fr">
          {items.map((card) => {
            const Icon = card.kind === 'comparison' ? GitCompareArrows : BookOpen
            const badge = card.kind === 'comparison' ? badgeComparison : badgePillar
            return (
              <Link
                key={card.slug}
                href={`/blog/${card.slug}`}
                className="group relative flex flex-col rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-6 transition-all hover:border-accent-system/40 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-accent-system">
                    <Icon className="w-3.5 h-3.5" aria-hidden />
                    {badge}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted shrink-0">
                    {card.readTime} {readTimeLabel}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-system">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {card.description}
                </p>

                <span className="mt-auto pt-5 inline-flex items-center gap-1 text-xs font-medium text-accent-system">
                  {readLabel}
                  <ArrowRight
                    className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <CTAButton
            href="/kennisbank"
            variant="secondary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {ctaLabel}
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
