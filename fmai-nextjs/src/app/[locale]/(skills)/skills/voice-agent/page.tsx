import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { SkillPageTemplate } from '@/components/skills/SkillPageTemplate'
import { VoiceDemoSection } from '@/components/voice/VoiceDemoSection'
import { VoiceDemoFAB } from '@/components/voice/VoiceDemoFAB'

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
    namespace: 'skills-voice-agent',
    path: '/skills/voice-agent',
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
      namespace="skills-voice-agent"
      slug="voice-agent"
      locale={locale}
      customProof={<><VoiceDemoSection /><VoiceDemoFAB /></>}
    />
  )
}
