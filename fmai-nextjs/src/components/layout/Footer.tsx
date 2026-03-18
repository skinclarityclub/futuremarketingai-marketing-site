import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

interface FooterProps {
  locale: string
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border-primary bg-bg-deep">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-xl font-bold font-display text-text-primary mb-2">
              Future<span className="text-accent-system">AI</span>
            </p>
            <p className="text-sm text-text-muted">{t('landing.footer.tagline')}</p>
          </div>

          <nav aria-label="Company links">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              {t('landing.footer.sections.company')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  {t('landing.footer.nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  {t('landing.footer.nav.how_it_works')}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  {t('landing.footer.nav.pricing')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              {t('landing.footer.sections.legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  {t('landing.footer.nav.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  {t('landing.footer.nav.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-border-primary text-center">
          <p className="text-xs text-text-muted">
            &copy; {year} Future Marketing AI. {t('footer.all_rights_reserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}
