import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Linkedin, Twitter } from 'lucide-react'
import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'
import { CookieReopenButton } from './CookieReopenButton'
import { FooterNewsletter } from './FooterNewsletter'

interface FooterProps {
  locale: string
}

type SkillHref =
  | '/skills/social-media'
  | '/skills/blog-factory'
  | '/skills/voice-agent'
  | '/skills/lead-qualifier'
  | '/skills/ad-creator'
  | '/skills/reel-builder'
  | '/skills/email-management'
  | '/skills/manychat'
  | '/skills/reporting'
  | '/skills/research'
  | '/skills/seo-geo'
  | '/skills/clyde'

interface FooterSkill {
  href: SkillHref
  navKey: string
  comingSoon?: boolean
}

const FOOTER_SKILLS: readonly FooterSkill[] = [
  { href: '/skills/clyde', navKey: 'clyde' },
  { href: '/skills/social-media', navKey: 'social_media' },
  { href: '/skills/blog-factory', navKey: 'blog_factory' },
  { href: '/skills/voice-agent', navKey: 'voice_agent', comingSoon: true },
  { href: '/skills/lead-qualifier', navKey: 'lead_qualifier' },
  { href: '/skills/email-management', navKey: 'email_management' },
  { href: '/skills/manychat', navKey: 'manychat' },
  { href: '/skills/ad-creator', navKey: 'ad_creator', comingSoon: true },
  { href: '/skills/reel-builder', navKey: 'reel_builder', comingSoon: true },
  { href: '/skills/reporting', navKey: 'reporting' },
  { href: '/skills/research', navKey: 'research' },
  { href: '/skills/seo-geo', navKey: 'seo_geo' },
]

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-16 bg-bg-deep">
      {/* Decorative top accent line — subtle accent-system gradient scanline */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-system/40 to-transparent"
      />
      <div className="border-t border-border-primary/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* 4-column bento: Brand+Newsletter | Skills | Company | Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-10">
            {/* Brand + Newsletter (4 cols on lg) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <LogoSynapse size={26} />
                <span className="font-display font-bold text-base text-text-primary tracking-tight">
                  {t('landing.footer.brand_name')}
                </span>
              </Link>
              <p className="text-sm text-text-muted max-w-xs leading-relaxed">
                {t('landing.footer.tagline')}
              </p>
              <div className="pt-2">
                <p className="font-mono uppercase tracking-[0.18em] text-[10px] text-accent-system mb-2.5">
                  {t('landing.footer.eyebrow.brand')}
                </p>
                <FooterNewsletter />
              </div>
            </div>

            {/* Skills column (4 cols on lg, 2-col internal grid) */}
            <nav aria-label={t('landing.footer.sections.skills')} className="lg:col-span-4">
              <p className="font-mono uppercase tracking-[0.18em] text-[10px] text-accent-system mb-3">
                {t('landing.footer.eyebrow.skills')}
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {FOOTER_SKILLS.map((skill) => (
                  <li key={skill.navKey}>
                    <Link
                      href={skill.href}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors inline-flex items-center gap-1.5 min-w-0 max-w-full group/skill"
                    >
                      <span
                        aria-hidden
                        className={`inline-block w-1.5 h-1.5 shrink-0 rounded-full transition-all ${
                          skill.comingSoon
                            ? 'bg-[#F5A623]/60 group-hover/skill:bg-[#F5A623]'
                            : 'bg-status-active/70 group-hover/skill:bg-status-active'
                        }`}
                      />
                      <span className="truncate">{t(`landing.footer.nav.${skill.navKey}`)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company column (2 cols on lg) */}
            <nav aria-label={t('landing.footer.sections.company')} className="lg:col-span-2">
              <p className="font-mono uppercase tracking-[0.18em] text-[10px] text-accent-system mb-3">
                {t('landing.footer.eyebrow.company')}
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.about')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.how_it_works')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.pricing')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/founding-member"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.founding_member')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/case-studies/skinclarity-club"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.caseStudies')}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Resources column (2 cols on lg) */}
            <nav aria-label={t('landing.footer.sections.resources')} className="lg:col-span-2">
              <p className="font-mono uppercase tracking-[0.18em] text-[10px] text-accent-system mb-3">
                {t('landing.footer.eyebrow.resources')}
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/apply"
                    className="text-sm font-medium text-accent-system hover:opacity-80 transition-opacity"
                  >
                    {t('landing.footer.nav.apply')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/memory"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.memory')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kennisbank"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.kennisbank')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kennisbank"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.blog')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.contact')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Bottom strip: copyright + status + legal + social + cookie-reopen */}
          <div className="pt-6 border-t border-border-primary/60">
            <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-xs text-text-muted">
                  {t('landing.footer.copyright', { year })}
                </p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent-system/10 border border-accent-system/20 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-system opacity-40" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-system" />
                  </span>
                  <span className="text-[10px] font-medium text-text-secondary">
                    {t('landing.footer.status_badge')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/legal/privacy"
                    className="text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.privacy')}
                  </Link>
                  <Link
                    href="/legal/terms"
                    className="text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.terms')}
                  </Link>
                  <Link
                    href="/legal/cookies"
                    className="text-xs text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.cookies')}
                  </Link>
                  <CookieReopenButton />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/futuremarketingai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md text-text-muted hover:text-accent-system hover:bg-white/5 transition-all"
                  aria-label={t('landing.footer.social_aria.linkedin')}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com/FutureMarketAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md text-text-muted hover:text-accent-system hover:bg-white/5 transition-all"
                  aria-label={t('landing.footer.social_aria.twitter')}
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
