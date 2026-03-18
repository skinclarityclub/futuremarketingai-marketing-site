import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { OgImageTemplate } from '@/lib/og-image'

export const alt = 'Future Marketing AI — AI-Powered Marketing Automation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const fontData = await readFile(join(process.cwd(), 'public/fonts/DMSans-Variable.ttf'))

  return new ImageResponse(
    (
      <OgImageTemplate
        title={t('meta.title')}
        description={t('meta.description')}
        label="Future Marketing AI"
      />
    ),
    {
      ...size,
      fonts: [{ name: 'DM Sans', data: fontData, weight: 600, style: 'normal' }],
    }
  )
}
