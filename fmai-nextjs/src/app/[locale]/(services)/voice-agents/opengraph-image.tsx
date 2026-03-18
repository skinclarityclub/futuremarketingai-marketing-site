import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { OgImageTemplate } from '@/lib/og-image'

export const alt = 'AI Voice Agents | Future Marketing AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'voice-agents' })
  const fontData = await readFile(join(process.cwd(), 'public/fonts/DMSans-Variable.ttf'))

  return new ImageResponse(
    (
      <OgImageTemplate
        title={t('meta.title')}
        description={t('meta.description')}
        label="AI Voice Agents"
      />
    ),
    {
      ...size,
      fonts: [{ name: 'DM Sans', data: fontData, weight: 600, style: 'normal' }],
    }
  )
}
