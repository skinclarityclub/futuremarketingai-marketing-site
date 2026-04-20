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
import { ContactForm } from '@/components/contact/ContactForm'

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
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Apply callout — redirect partnership requests to /apply */}
      <section className="px-6 lg:px-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="border border-accent-system/30 bg-accent-system/5 rounded-[var(--radius-card)] p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-text-primary mb-1">
                {t('applyCallout.title')}
              </h2>
              <p className="text-sm text-text-secondary">{t('applyCallout.body')}</p>
            </div>
            <a
              href="/apply"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-accent-system text-bg-deep font-semibold rounded-[var(--radius-btn)] hover:opacity-90 transition-opacity text-sm"
            >
              {t('applyCallout.button')}
            </a>
          </div>
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
              <ContactForm
                labels={{
                  name: t('form.name_label'),
                  namePlaceholder: t('form.name_placeholder'),
                  email: t('form.email_label'),
                  emailPlaceholder: t('form.email_placeholder'),
                  company: t('form.company_label'),
                  companyPlaceholder: t('form.company_placeholder'),
                  message: t('form.message_label'),
                  messagePlaceholder: t('form.message_placeholder'),
                  submit: t('form.submit_button'),
                }}
              />
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
                <CTAButton href="/apply">{t('book_demo.button')}</CTAButton>
              </GlassCard>

              {/* Direct Contact */}
              <GlassCard>
                <h3 className="text-xl font-bold font-display text-text-primary mb-4">
                  {t('direct_contact.title')}
                </h3>
                <address className="space-y-4 not-italic">
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
                </address>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
