import {
  Instagram,
  Facebook,
  MessageCircle,
  Send,
  Mail,
  BarChart3,
  Search,
  ShoppingBag,
  Workflow,
  Linkedin,
  Youtube,
  Twitter,
  Music2,
  AtSign,
  Pin,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

/**
 * De kanalen, in TWEE rijen — en dat onderscheid is de hele truc.
 *
 * Eén platte logomuur zou liegen in de ene of de andere richting. Alleen tonen
 * wat vandaag publiceert (Instagram) verzwijgt dat de rest een kwestie van
 * koppelen is; alles tonen als "draait" herhaalt precies de vijftien valse
 * claims die de audit van 2026-09-01 vond (LinkedIn-publicatie, TikTok-ads,
 * Slack, WordPress, Ahrefs — geen daarvan bestaat in de codebase).
 *
 * RIJ 1, gemeten op de productiedatabase 2026-09-02:
 *   Instagram 3.360 ingepland / 376 gepubliceerd · Gmail 10.829 maillogs ·
 *   GA4 + Search Console syncen dagelijks · Shopify 1 koppeling ok ·
 *   ManyChat 5 tokens · WhatsApp en Telegram zijn de twee echte Clyde-kanalen.
 *
 * RIJ 2, publicatiekanalen die via Postiz aangesloten kunnen worden. Postiz
 * ondersteunt 27 platforms (as of 2026-09, docs.postiz.com/public-api/
 * integrations/list). In content_schedule staat naast instagram alleen linkedin
 * met 18 ingeplande en NUL gepubliceerde items — koppelbaar dus, nog niet in
 * gebruik. Dat verschil staat in het label, niet in de kleine lettertjes.
 *
 * Neutrale lucide-iconen in plaats van merklogo's: dat vermijdt de merkrecht-
 * vraag volledig. Echte logo's vragen om een merkenrechtelijke caption.
 */
const LIVE = [
  { key: 'instagram', Icon: Instagram },
  { key: 'meta', Icon: Facebook },
  { key: 'whatsapp', Icon: MessageCircle },
  { key: 'telegram', Icon: Send },
  { key: 'gmail', Icon: Mail },
  { key: 'analytics', Icon: BarChart3 },
  { key: 'searchConsole', Icon: Search },
  { key: 'shopify', Icon: ShoppingBag },
  { key: 'n8n', Icon: Workflow },
] as const

const CONNECTABLE = [
  { key: 'linkedin', Icon: Linkedin },
  { key: 'tiktok', Icon: Music2 },
  { key: 'youtube', Icon: Youtube },
  { key: 'x', Icon: Twitter },
  { key: 'facebook', Icon: Facebook },
  { key: 'threads', Icon: AtSign },
  { key: 'pinterest', Icon: Pin },
] as const

function Row({
  items,
  dim,
}: {
  items: ReadonlyArray<{ key: string; Icon: typeof Instagram }>
  dim?: boolean
}) {
  return (
    <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
      {items.map(({ key, Icon }) => (
        <li
          key={key}
          className={`flex items-center gap-2 transition-colors duration-200 ${
            dim
              ? 'text-text-muted/70 hover:text-text-muted'
              : 'text-text-secondary/80 hover:text-text-secondary'
          }`}
        >
          <Icon className="w-[17px] h-[17px] shrink-0" aria-hidden="true" />
          <span className={dim ? 'text-[13px]' : 'text-sm'}>{key}</span>
        </li>
      ))}
    </ul>
  )
}

export async function PlatformStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.platforms' })

  const label = (k: string) => t(`items.${k}`)
  const live = LIVE.map((p) => ({ ...p, key: label(p.key) }))
  const connectable = CONNECTABLE.map((p) => ({ ...p, key: label(p.key) }))

  return (
    <section aria-labelledby="platforms" className="py-14 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <h2
          id="platforms"
          className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-accent-system"
        >
          {t('liveTitle')}
        </h2>
        <Row items={live} />

        <div className="mt-10 pt-8 border-t border-border-primary/60">
          <h3 className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            {t('connectableTitle')}
          </h3>
          <Row items={connectable} dim />
          <p className="mt-5 text-center text-xs text-text-muted max-w-xl mx-auto leading-relaxed">
            {t('note')}
          </p>
        </div>
      </div>
    </section>
  )
}
