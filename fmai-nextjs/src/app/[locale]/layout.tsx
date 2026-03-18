import type { ReactNode } from 'react'
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
import { ClientIslands } from '@/components/providers/ClientIslands'
import '@/app/globals.css'

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
      <body className="bg-bg-deep text-text-primary font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <OrganizationJsonLd />
            <Header locale={locale} />
            {children}
            <Footer locale={locale} />
            <CookieConsentBanner />
            <ClientIslands />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
