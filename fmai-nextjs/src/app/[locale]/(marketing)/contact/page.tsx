import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'
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
        path="/contact"
      />
      <Breadcrumbs path="/contact" locale={locale} />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 lg:px-12" aria-labelledby="contact-hero">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <EyebrowLabel>{t('hero.eyebrow')}</EyebrowLabel>
          <h1
            id="contact-hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary"
          >
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
          <ScrollReveal>
            <div className="border border-accent-system/30 bg-gradient-to-br from-accent-system/10 via-accent-system/5 to-transparent rounded-[var(--radius-card)] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex-1 space-y-2">
                <EyebrowLabel>{t('applyCallout.eyebrow')}</EyebrowLabel>
                <h2 className="text-lg font-semibold text-text-primary">
                  {t('applyCallout.title')}
                </h2>
                <p className="text-sm text-text-secondary">{t('applyCallout.body')}</p>
              </div>
              <Link
                href="/apply"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-accent-system text-bg-deep font-semibold rounded-[var(--radius-btn)] hover:brightness-110 transition-[filter] text-sm"
              >
                {t('applyCallout.button')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="contact-form-heading">
        <RevealContainer className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <RevealItem>
            <GlassCard className="space-y-6">
              <div className="space-y-2">
                <EyebrowLabel>{t('form.eyebrow')}</EyebrowLabel>
                <h2
                  id="contact-form-heading"
                  className="text-2xl font-bold font-display text-text-primary"
                >
                  {t('form.title')}
                </h2>
              </div>
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
                  statusSending: t('form.status.sending'),
                  statusSuccessTitle: t('form.status.successTitle'),
                  statusSuccessBody: t('form.status.successBody'),
                  statusSendAnother: t('form.status.sendAnother'),
                  statusNetworkError: t('form.status.networkError'),
                  statusGenericError: t('form.status.genericError'),
                  statusCalendlyOffer: t('form.status.calendlyOffer'),
                  statusCalendlyCta: t('form.status.calendlyCta'),
                  requiredNote: t('form.required_note'),
                  optionalSuffix: t('form.optional_suffix'),
                }}
              />
            </GlassCard>
          </RevealItem>

          {/* Contact Info & CTAs */}
          <RevealItem>
            <GlassCard className="space-y-6">
              <div className="space-y-2">
                <EyebrowLabel>{t('direct_contact.eyebrow')}</EyebrowLabel>
                <h3 className="text-xl font-bold font-display text-text-primary">
                  {t('direct_contact.title')}
                </h3>
              </div>
              <address className="space-y-4 not-italic">
                {/* Email */}
                <a
                  href="mailto:hello@future-marketing.ai"
                  className="flex items-start gap-3 text-text-secondary hover:text-accent-system transition-colors group"
                >
                  <Mail
                    className="w-5 h-5 mt-0.5 text-accent-system flex-shrink-0 transition-transform group-hover:scale-110"
                    aria-hidden
                  />
                  <div>
                    <div className="text-sm text-text-muted mb-1">
                      {t('direct_contact.email_label')}
                    </div>
                    <div className="font-semibold">{t('direct_contact.email_address')}</div>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-3 text-text-secondary">
                  <MapPin
                    className="w-5 h-5 mt-0.5 text-accent-system flex-shrink-0"
                    aria-hidden
                  />
                  <div>
                    <div className="text-sm text-text-muted mb-1">
                      {t('direct_contact.location_label')}
                    </div>
                    <div className="font-semibold">{t('direct_contact.location_text')}</div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-3 text-text-secondary">
                  <Clock
                    className="w-5 h-5 mt-0.5 text-accent-system flex-shrink-0"
                    aria-hidden
                  />
                  <div>
                    <div className="text-sm text-text-muted mb-1">
                      {t('direct_contact.response_time_label')}
                    </div>
                    <div className="font-semibold">{t('direct_contact.response_time_text')}</div>
                  </div>
                </div>
              </address>
            </GlassCard>
          </RevealItem>
        </RevealContainer>
      </section>
    </PageShell>
  )
}
