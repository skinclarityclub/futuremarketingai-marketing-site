import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'
import { CookieReopenButton } from './CookieReopenButton'
import { FooterNewsletter } from './FooterNewsletter'

interface FooterProps {
  locale: string
}

// Golf 8b (2026-11-07, prototype R/golf8-nav.tpl.html): six columns that link only to pages that exist.
// Golf 9a (2026-11-08) added Strategie and Binnenkort to the makes column. Labels live in common.landing.footer.{sections,nav}.
const COLUMNS = [
  {
    key: 'clyde',
    links: [
      { key: 'clyde', href: '/skills/clyde' },
      { key: 'client_portal', href: '/client-portal' },
      { key: 'memory', href: '/memory' },
      { key: 'trust', href: '/trust' },
      { key: 'alternatives', href: '/alternatives' },
    ],
  },
  {
    key: 'makes',
    links: [
      { key: 'strategy', href: '/skills/strategy' },
      { key: 'social_media', href: '/skills/social-media' },
      { key: 'blog_factory', href: '/skills/blog-factory' },
      { key: 'lead_qualifier', href: '/skills/lead-qualifier' },
      { key: 'reporting', href: '/skills/reporting' },
      { key: 'seo_geo', href: '/skills/seo-geo' },
      { key: 'ad_creator', href: '/skills/ad-manager' },
      { key: 'email_management', href: '/skills/email-management' },
      { key: 'all_skills', href: '/skills' },
      { key: 'soon', href: '/skills#binnenkort' },
    ],
  },
  {
    key: 'cases',
    links: [
      { key: 'skc', href: '/case-studies/skinclarity-club' },
      { key: 'saleslobe', href: '/case-studies/saleslobe' },
      { key: 'caseStudies', href: '/case-studies' },
    ],
  },
  {
    key: 'company',
    links: [
      { key: 'about', href: '/about' },
      { key: 'how_it_works', href: '/how-it-works' },
      { key: 'pricing', href: '/pricing' },
      { key: 'contact', href: '/contact' },
      { key: 'apply', href: '/apply' },
    ],
  },
  {
    key: 'learn',
    links: [
      { key: 'kennisbank', href: '/kennisbank' },
      { key: 'assessment', href: '/assessment' },
    ],
  },
  {
    key: 'legal',
    links: [
      { key: 'privacy', href: '/legal/privacy' },
      { key: 'terms', href: '/legal/terms' },
      { key: 'cookies', href: '/legal/cookies' },
      // No anchor: /trust has no #dpa, only tr-* ids on its headings
      { key: 'dpa', href: '/trust' },
    ],
  },
] as const

const LINK_CLASS = 'text-[14.5px] leading-[1.4] text-[#c4ccd8] hover:text-[#f4f7fb] transition-colors'

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-16 bg-bg-deep">
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-system/40 to-transparent"
      />
      <div className="border-t border-border-primary/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-[clamp(36px,5vw,56px)] pb-7">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-end gap-x-12 gap-y-6 pb-7 border-b border-white/[0.08]">
            <div>
              <Link href="/" className="flex items-center gap-2.5 w-fit">
                <LogoSynapse size={28} />
                <span className="font-display font-bold text-lg tracking-tight text-[#f4f7fb]">
                  FutureMarketing<span className="text-accent-system">AI</span>
                </span>
              </Link>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.55] text-[#c4ccd8]">
                {t('landing.footer.tagline')}
              </p>
            </div>
            <FooterNewsletter />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-7 py-8">
            {COLUMNS.map((col) => (
              <nav key={col.key} aria-label={t(`landing.footer.sections.${col.key}`)}>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#a3adbd]">
                  {t(`landing.footer.sections.${col.key}`)}
                </p>
                <ul className="mt-3.5 flex flex-col gap-[9px]">
                  {col.links.map((link) => (
                    <li key={link.key}>
                      <Link href={link.href} className={LINK_CLASS}>
                        {t(`landing.footer.nav.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                  {col.key === 'legal' && (
                    <li>
                      <CookieReopenButton />
                    </li>
                  )}
                </ul>
              </nav>
            ))}
          </div>

          <div className="flex flex-wrap justify-between gap-3 pt-5 border-t border-white/[0.08] text-[13px] text-[#a3adbd]">
            <p>{t('landing.footer.copyright', { year })}</p>
            {/* No X/Twitter: twitter.com/FutureMarketAI and x.com/FutureMarketAI both 404 and there is no X
                account. Instagram, TikTok and Threads are real channels but their profile URLs are not stored
                anywhere in the repo or the database, so adding them needs the actual handles. */}
            <a
              href="https://www.linkedin.com/company/futuremarketingai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('landing.footer.social_aria.linkedin')}
              className="hover:text-[#f4f7fb] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
