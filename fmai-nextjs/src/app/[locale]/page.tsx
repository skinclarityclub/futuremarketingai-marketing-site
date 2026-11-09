import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebSiteJsonLd } from '@/components/seo/WebSiteJsonLd'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { WeekSection } from '@/components/home/week/WeekSection'
import { Hero3Section } from '@/components/home/hero3/Hero3Section'
import { RegieKlantSections } from '@/components/home/secties/RegieKlantSections'
import { WerkAanvraagSections } from '@/components/home/werk/WerkAanvraagSections'
import { WaaromKlantenSections } from '@/components/home/klanten/WaaromKlantenSections'
import { StartPrijsVragenSecties } from '@/components/home/start/StartPrijsVragenSecties'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'home', path: '/' })
}

// The FAQ schema names the questions #vragen shows, nothing hidden.
const VRAGEN_KEYS = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9'] as const

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <PageShell showStickyCta>
      {/* Hero 3's phone LCP is the LinkedIn post in the front phone, a CSS background that the browser only finds
          after layout, at low priority (Lighthouse mobile LCP 6.5 s locally). Below 600 px the calendar is a 1 px GIF. */}
      <link
        rel="preload"
        as="image"
        fetchPriority="high"
        media="(max-width: 599px)"
        href="/home/hero3/meerkade_posts_meerkade-li-twintig-minuten-1.webp"
      />

      {/* JSON-LD Structured Data */}
      <WebSiteJsonLd />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/"
        locale={locale}
        speakableSelectors={['.speakable-hero', '.speakable-tldr']}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }]} locale={locale} />
      <FaqJsonLd
        items={VRAGEN_KEYS.map((key) => ({
          question: t(`vragen.questions.${key}`),
          answer: t(`vragen.answers.${key}`),
        }))}
        path="/"
        locale={locale}
      />

      {/* The homepage of the 2026-11 redesign, the same twelve sections on /nl and /en (golf 10, Daley 2026-11-08:
          "/en = /nl-structuur"). The app screens and the example brands' posts are Dutch captures on both. */}
      <Hero3Section />
      <WeekSection />
      <RegieKlantSections />
      <WerkAanvraagSections />
      <WaaromKlantenSections />
      <StartPrijsVragenSecties />
    </PageShell>
  )
}
