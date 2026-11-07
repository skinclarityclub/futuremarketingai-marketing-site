import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { ClientPortalSections } from '@/components/clientportal/ClientPortalSections'

const PATH = '/client-portal'
const FAQ_KEYS = ['brand', 'approver', 'whatsapp', 'price'] as const

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'client_portal', path: PATH })
}

export default async function ClientPortalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'client_portal' })
  const tc = await getTranslations({ locale, namespace: 'common.breadcrumbs' })

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path={PATH}
        locale={locale}
        speakableSelectors={['.speakable-cp-def']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: tc('client_portal'), path: PATH },
        ]}
        locale={locale}
      />
      {/* same words as the visible questions; the link tag in the price answer becomes plain text */}
      <FaqJsonLd
        items={FAQ_KEYS.map((k) => ({
          question: t(`faq.items.${k}.q`),
          answer: t.markup(`faq.items.${k}.a`, { link: (c) => c }),
        }))}
        path={PATH}
        locale={locale}
      />
      <ClientPortalSections locale={locale} />
    </PageShell>
  )
}
