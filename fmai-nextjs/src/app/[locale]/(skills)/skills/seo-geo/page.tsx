import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { SkillPageTemplate } from '@/components/skills/SkillPageTemplate'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    locale,
    namespace: 'skills-seo-geo',
    path: '/skills/seo-geo',
  })
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <SkillPageTemplate
      namespace="skills-seo-geo"
      slug="seo-geo"
      locale={locale}
      customProof={undefined}
    />
  )
}
