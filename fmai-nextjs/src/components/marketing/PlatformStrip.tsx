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
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

/**
 * De kanalen waar Clyde daadwerkelijk op draait.
 *
 * ELKE REGEL HIER IS GEMETEN op de productiedatabase (2026-09-02), niet
 * overgeschreven uit een roadmap. Dat is geen overdreven zorgvuldigheid: de
 * audit van 2026-09-01 vond dat de site LinkedIn-publicatie, TikTok-ads,
 * Outlook, Slack, WordPress, Webflow, Ghost, Notion, HubSpot, Ahrefs, Semrush,
 * Runway, Pika, Twilio en Telnyx claimde — geen daarvan komt in de codebase
 * voor. Een logostrip is precies de plek waar zo'n lijst weer aangroeit.
 *
 * BEWUST NIET IN DEZE LIJST:
 *   LinkedIn  er is geen LinkedIn-client; publicatie loopt niet via de API
 *   TikTok    niet gekoppeld; Ad Manager publiceert alleen naar Meta
 *   Outlook   credentials bestaan, nul syncen, de eigen skill-pagina zegt roadmap
 *
 * Geen merklogo's maar neutrale iconen uit lucide (al een dependency). Dat
 * vermijdt de merkrechtvraag volledig en houdt de strip in de huisstijl. Wil je
 * echte logo's, dan hoort daar een merkenrechtelijke caption bij.
 */
const PLATFORMS = [
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

export async function PlatformStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.platforms' })

  return (
    <section aria-labelledby="platforms" className="py-14 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <h2
          id="platforms"
          className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted"
        >
          {t('title')}
        </h2>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          {PLATFORMS.map(({ key, Icon }) => (
            <li
              key={key}
              className="flex items-center gap-2 text-text-secondary/70 transition-colors duration-200 hover:text-text-secondary"
            >
              <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
              <span className="text-sm">{t(`items.${key}`)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs text-text-muted max-w-xl mx-auto leading-relaxed">
          {t('note')}
        </p>
      </div>
    </section>
  )
}
