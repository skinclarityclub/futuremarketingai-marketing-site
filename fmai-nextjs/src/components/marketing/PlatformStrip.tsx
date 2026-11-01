import { getTranslations } from 'next-intl/server'
import { BrandMark, type BrandKey } from './BrandMark'

/**
 * De kanalen waar Clyde vandaag in draait, in één rij.
 *
 * Tot 2026-11-01 waren dit twee rijen ("draait vandaag" en "koppelbaar op
 * verzoek"), omdat alleen Instagram en LinkedIn publiceerden. Sinds fma-app
 * #1587 (2026-10-19) publiceert de app ook naar Facebook, X, Threads, TikTok en
 * YouTube via Postiz, met per kanaal een live testpost als bewijs. Daarmee
 * waren alle zes "koppelbaar"-kanalen behalve Pinterest live, en is de tweede
 * rij vervallen. Andere Postiz-netwerken staan alleen nog in de noot.
 *
 * Telegram is uit de marketingtekst gehaald (Daley 2026-11-01): het werkt
 * technisch, maar Clyde wordt via WhatsApp gebruikt. De privacytekst noemt
 * Telegram nog als sub-verwerker, en dat moet zo blijven zolang het kanaal bestaat.
 *
 * Neutrale lucide-iconen in plaats van merklogo's: dat vermijdt de merkrecht-
 * vraag volledig. Echte logo's vragen om een merkenrechtelijke caption.
 */
const LIVE: readonly BrandKey[] = [
  'instagram',
  'facebook',
  'linkedin',
  'x',
  'threads',
  'tiktok',
  'youtube',
  'meta',
  'whatsapp',
  'gmail',
  'analytics',
  'searchConsole',
  'shopify',
  'n8n',
]

export async function PlatformStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.platforms' })

  return (
    <section aria-labelledby="platforms" className="py-14 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <h2
          id="platforms"
          className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-accent-system"
        >
          {t('liveTitle')}
        </h2>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          {LIVE.map((key) => (
            <li
              key={key}
              className="flex items-center gap-2 text-text-secondary/80 hover:text-text-secondary transition-colors duration-200"
            >
              <BrandMark name={key} className="w-[17px] h-[17px] shrink-0" />
              <span className="text-sm">{t(`items.${key}`)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs text-text-muted max-w-xl mx-auto leading-relaxed">
          {t('note')}
        </p>
      </div>
    </section>
  )
}
