import {
  siInstagram,
  siMeta,
  siWhatsapp,
  siTelegram,
  siGmail,
  siGoogleanalytics,
  siGooglesearchconsole,
  siShopify,
  siN8n,
  siTiktok,
  siYoutube,
  siX,
  siFacebook,
  siThreads,
  siPinterest,
} from 'simple-icons'
import { Linkedin } from 'lucide-react'

/**
 * Merktekens voor de kanalenstrip, monochroom.
 *
 * WAAROM MONOCHROOM EN NIET IN MERKKLEUR. Een rij grijze merktekens leest als
 * een compatibiliteitslijst; zeven felle kleurvlekken lezen als partnerbadges.
 * Dat verschil is hier niet cosmetisch: de tweede rij van de strip gaat over
 * kanalen die we NOG NIET gebruiken, en de suggestie van een partnerschap is
 * precies wat verwijzend merkgebruik niet mag wekken. Vrijwel elke merkrichtlijn
 * staat een monochrome variant expliciet toe. Het past bovendien beter in het
 * donkere ontwerp.
 *
 * LINKEDIN KRIJGT BEWUST GEEN MERKTEKEN — besluit 2026-09-02, herzie het hier.
 *
 * Het merk ontbreekt in simple-icons 16.29.0 terwijl de andere vijftien er wel
 * in zitten. Niet na een verzoek van LinkedIn (dat dachten we eerst), maar
 * omdat de maintainers hun gepubliceerde merkvoorwaarden lazen en proactief
 * verwijderden — issue simple-icons#11372, juli 2024. Die voorwaarden zijn de
 * reden dat het hier ook niet staat:
 *
 *   "LinkedIn generally does not permit its members, third party developers,
 *    partners and the media to use its name, trademarks, logos, web pages,
 *    screenshots and other brand features. Narrow and specific exceptions are
 *    detailed below. Any other uses must obtain prior approval from LinkedIn."
 *
 * Dat is wezenlijk strenger dan Instagram, TikTok of YouTube, die verwijzend
 * gebruik breed tolereren. Standaard nee, tenzij je binnen een genoemde
 * uitzondering valt of vooraf toestemming hebt. Het visuele verschil met het
 * neutrale glyph is verwaarloosbaar en de opbrengst weegt niet op tegen een
 * handhavingsbrief. Wil je het alsnog: lees de uitzonderingen op
 * brand.linkedin.com, of vraag toestemming, en vervang dan ALLEEN deze tak.
 *
 * Alle zes de plekken die het LinkedIn-glyph tonen (footer, twee testimonial-
 * blokken, de assessment-uitslag, de SKC-case en de kanalenstrip) lopen via
 * deze component. Dat is niet netheid maar houdbaarheid: lucide 1.0 verwijdert
 * ÁLLE merkiconen — om precies dezelfde reden — en dan breekt hier één import
 * in plaats van zes. Dit project draait 0.577, dus het is nog niet acuut.
 *
 * De paden in simple-icons staan onder CC0, maar dat gaat over AUTEURSRECHT.
 * De merken blijven van de merkhouders; CC0 is geen merkenrechtelijke vrijbrief.
 */
const MARKS = {
  instagram: siInstagram,
  meta: siMeta,
  whatsapp: siWhatsapp,
  telegram: siTelegram,
  gmail: siGmail,
  analytics: siGoogleanalytics,
  searchConsole: siGooglesearchconsole,
  shopify: siShopify,
  n8n: siN8n,
  tiktok: siTiktok,
  youtube: siYoutube,
  x: siX,
  facebook: siFacebook,
  threads: siThreads,
  pinterest: siPinterest,
} as const

export type BrandKey = keyof typeof MARKS | 'linkedin'

export function BrandMark({ name, className }: { name: BrandKey; className?: string }) {
  if (name === 'linkedin') {
    return <Linkedin className={className} aria-hidden="true" />
  }
  const icon = MARKS[name]
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  )
}
