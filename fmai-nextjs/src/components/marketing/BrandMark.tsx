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
 * LINKEDIN KOMT NIET UIT SIMPLE-ICONS. Dat merk is daar op verzoek van LinkedIn
 * zelf uit verwijderd — het ontbreekt in 16.29.0 terwijl alle andere vijftien er
 * wel in zitten. Van alle merken in deze strip is dat de enige die aantoonbaar
 * heeft gehandhaafd op verspreiding van zijn teken, dus daar staat een neutraal
 * lucide-glyph in plaats van hun mark. Wil je LinkedIn's echte logo, haal het
 * dan bij hun eigen brand-resources en volg die richtlijn.
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
