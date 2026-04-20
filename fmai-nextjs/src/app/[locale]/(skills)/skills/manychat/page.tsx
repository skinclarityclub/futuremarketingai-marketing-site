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
    namespace: 'skills-manychat',
    path: '/skills/manychat',
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
      namespace="skills-manychat"
      slug="manychat"
      locale={locale}
      customProof={undefined}
    />
  )
}
