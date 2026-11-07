import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { SkillPageTemplate } from '@/components/skills/SkillPageTemplate'
import '@/components/proof/proof.css'

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
    namespace: 'skills-lead-qualifier',
    path: '/skills/lead-qualifier',
  })
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'skills-lead-qualifier' })

  // Golf 9a: the website-chat demo (DemoPlayground) made way for the real RUST rule from the demo environment,
  // the same screen as on the /skills hub. The page is about the Instagram DM flow, not a chat widget.
  const rule = (
    <div className="g6" style={{ background: 'transparent', maxWidth: 773, marginInline: 'auto' }}>
      <figure className="g6-shot">
        {/* --w is half the pixel width of the 2x capture, so the screen is never shown larger than it is (proof.css) */}
        <div className="g6-win g6-fit" style={{ '--w': '773px' } as CSSProperties}>
          <div className="g6-winbar">
            <i />
            <i />
            <i />
            <span>{t('proof.shot.bar')}</span>
          </div>
          <div className="g6-scroll" tabIndex={0} role="region" aria-label={t('proof.shot.scrollLabel')}>
            <Image
              src="/home/werk/g3-dm-regel-rust.png"
              width={1545}
              height={250}
              sizes="773px"
              alt={t('proof.shot.alt')}
              loading="lazy"
            />
          </div>
        </div>
        <figcaption className="g6-cap">
          <span>{t('proof.shot.caption')}</span>
          <span className="g6-demo">{t('proof.demo')}</span>
        </figcaption>
      </figure>
    </div>
  )

  return (
    <SkillPageTemplate
      namespace="skills-lead-qualifier"
      slug="lead-qualifier"
      locale={locale}
      customProof={rule}
      featuresAnchor="instagram-dm"
    />
  )
}
