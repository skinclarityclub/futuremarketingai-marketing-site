import type { ReactNode } from 'react'
import type { Viewport } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getMessages, getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { dmSans, jetbrainsMono, spaceGrotesk } from '@/lib/fonts'
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/components/providers/Providers'
import { CookieConsentBanner } from '@/components/interactive/CookieConsentBanner'
import { FloatingLocaleSwitcher } from '@/components/common/FloatingLocaleSwitcher'
import { ClientIslands } from '@/components/providers/ClientIslands'
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter'
import { GradientMesh } from '@/components/hero/GradientMesh'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/app/globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata = {
  metadataBase: new URL('https://future-marketing.ai'),
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'a11y' })

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      {/*
        Spline preconnect + scene prefetch live on the home page only
        (src/app/[locale]/page.tsx) to avoid 1.3 MB of bandwidth on the
        86 non-home prerendered routes. See 13-01-PLAN.md Task 2.
      */}
      <body className="bg-bg-deep text-text-primary font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-system focus:text-bg-deep focus:font-semibold focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-accent-system"
        >
          {t('skipToContent')}
        </a>
        <GradientMesh />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <OrganizationJsonLd />
            <Header locale={locale} />
            <FloatingLocaleSwitcher />
            {children}
            <Footer locale={locale} />
            <CookieConsentBanner />
            <ClientIslands />
            <WebVitalsReporter />
          </Providers>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
