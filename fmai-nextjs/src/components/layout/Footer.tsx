import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Sparkles, Linkedin, Twitter } from 'lucide-react'

interface FooterProps {
  locale: string
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-16 border-t border-border-primary bg-bg-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Brand + Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Sparkles className="w-5 h-5 text-accent-system transition-transform group-hover:rotate-12" />
              <span className="font-bold text-base text-text-primary">
                {t('landing.footer.brand_name')}
              </span>
            </Link>
            <p className="text-sm text-text-muted max-w-xs">{t('landing.footer.tagline')}</p>
          </div>

          {/* Navigation Grid: Services | Company | Resources */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
            {/* Services */}
            <nav aria-label="Services">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
                {t('landing.footer.sections.services')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/chatbots"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.chatbots')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/automations"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.automations')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/voice-agents"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.voice_agents')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketing-machine"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {t('landing.footer.nav.marketing_machine')}
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
              </ul>
            </nav>

            {/* Company */}
            <nav aria-label="Company">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
                {t('landing.footer.sections.company')}
              </h3>
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
              </ul>
            </nav>

            {/* Resources */}
            <nav aria-label="Resources">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
                {t('landing.footer.sections.resources')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
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
        </div>

        {/* Bottom Section: Copyright + Legal + Social */}
        <div className="pt-8 border-t border-border-primary">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Copyright + Status + Legal links */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-xs text-text-muted">{t('landing.footer.copyright', { year })}</p>
              <div className="flex items-center gap-2 px-3 py-1 bg-accent-system/10 border border-accent-system/20 rounded-sm">
                <div className="w-1.5 h-1.5 bg-accent-system rounded-full animate-pulse" />
                <span className="text-xs text-text-secondary">
                  {t('landing.footer.status_badge')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/legal"
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  {t('landing.footer.nav.privacy')}
                </Link>
                <Link
                  href="/legal"
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  {t('landing.footer.nav.terms')}
                </Link>
                <Link
                  href="/legal"
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  {t('landing.footer.nav.cookies')}
                </Link>
              </div>
            </div>

            {/* Right: Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/futuremarketingai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-system transition-colors"
                aria-label={t('landing.footer.social_aria.linkedin')}
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/FutureMarketAI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-system transition-colors"
                aria-label={t('landing.footer.social_aria.twitter')}
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
