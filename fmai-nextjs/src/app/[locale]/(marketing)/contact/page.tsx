import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'contact', path: '/contact' })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/contact"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('hero.title'), path: '/contact' },
        ]}
        locale={locale}
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="contact-form">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <ScrollReveal>
            <GlassCard>
              <SectionHeading id="contact-form" className="text-2xl mb-6">
                {t('form.title')}
              </SectionHeading>
              <form className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    {t('form.name_label')}
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-border-primary rounded-[var(--radius-btn)] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-system transition-all"
                    placeholder={t('form.name_placeholder')}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    {t('form.email_label')}
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-border-primary rounded-[var(--radius-btn)] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-system transition-all"
                    placeholder={t('form.email_placeholder')}
                    required
                  />
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="contact-company"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    {t('form.company_label')}
                  </label>
                  <input
                    type="text"
                    id="contact-company"
                    name="company"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-border-primary rounded-[var(--radius-btn)] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-system transition-all"
                    placeholder={t('form.company_placeholder')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    {t('form.message_label')}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-border-primary rounded-[var(--radius-btn)] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-system transition-all resize-none"
                    placeholder={t('form.message_placeholder')}
                    required
                  />
                </div>

                {/* Submit Button */}
                <CTAButton type="submit" className="w-full justify-center">
                  {t('form.submit_button')}
                </CTAButton>
              </form>
            </GlassCard>
          </ScrollReveal>

          {/* Contact Info & CTAs */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-6">
              {/* Book a Demo */}
              <GlassCard highlighted className="text-center">
                <SectionHeading id="book-demo" className="text-2xl mb-3">
                  {t('book_demo.title')}
                </SectionHeading>
                <p className="text-text-secondary mb-4">{t('book_demo.description')}</p>
                <CTAButton href="/contact">{t('book_demo.button')}</CTAButton>
              </GlassCard>

              {/* Direct Contact */}
              <GlassCard>
                <h3 className="text-xl font-bold font-display text-text-primary mb-4">
                  {t('direct_contact.title')}
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <a
                    href="mailto:hello@futuremarketingai.com"
                    className="flex items-start gap-3 text-text-secondary hover:text-accent-system transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mt-0.5 text-accent-system flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <div className="text-sm text-text-muted mb-1">
                        {t('direct_contact.email_label')}
                      </div>
                      <div className="font-semibold">{t('direct_contact.email_address')}</div>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-3 text-text-secondary">
                    <svg
                      className="w-5 h-5 mt-0.5 text-accent-system flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <div className="text-sm text-text-muted mb-1">
                        {t('direct_contact.location_label')}
                      </div>
                      <div className="font-semibold">{t('direct_contact.location_text')}</div>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-start gap-3 text-text-secondary">
                    <svg
                      className="w-5 h-5 mt-0.5 text-accent-system flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <div className="text-sm text-text-muted mb-1">
                        {t('direct_contact.response_time_label')}
                      </div>
                      <div className="font-semibold">{t('direct_contact.response_time_text')}</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
