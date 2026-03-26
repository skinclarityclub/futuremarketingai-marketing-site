import type { ReactNode } from 'react'
import type { Viewport } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getMessages } from 'next-intl/server'
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
import '@/app/globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata = {
  metadataBase: new URL('https://futuremarketingai.com'),
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

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        {/* Prefetch Spline scene binary so it's cached before component mounts */}
        <link
          rel="prefetch"
          href="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-bg-deep text-text-primary font-sans antialiased">
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
      </body>
    </html>
  )
}
