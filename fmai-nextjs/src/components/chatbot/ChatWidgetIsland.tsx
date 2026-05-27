'use client'

import { usePathname } from '@/i18n/navigation'
import { ChatWidget } from './ChatWidget'

/**
 * Page-aware welcome messages. The pathname returned by next-intl's
 * usePathname is the locale-stripped path (e.g. "/skills/voice-agent"
 * on both /nl/skills/voice-agent and /en/skills/voice-agent), so the
 * same keys cover all locales. NL is the source of truth for tone;
 * Clyde reads as a Dutch senior colleague.
 */
const WELCOME_MESSAGES: Record<string, string> = {
  '/': 'Hoi, ik ben Clyde. Vertel waar ik aan kan werken.',
  '/skills/social-media':
    'Hoi, ik ben Clyde. Wil je dat ik een content-kalender opzet voor een van je merken?',
  '/skills/voice-agent':
    'Hoi, ik ben Clyde. Ik kan laten zien hoe ik telefoons opneem of een vraag beantwoorden.',
  '/skills/lead-qualifier':
    'Hoi, ik ben Clyde. Dit is precies wat je klanten op hun site zouden krijgen.',
  '/skills/ad-creator':
    'Hoi, ik ben Clyde. Geef me een briefing en ik draai er varianten uit.',
  '/skills/email-management':
    'Hoi, ik ben Clyde. Ik filter je Gmail en stuur dagelijks een digest van wat ertoe doet.',
  '/skills/reporting':
    'Hoi, ik ben Clyde. Ik laat zien hoe een weekrapport eruitziet.',
  '/pricing':
    'Hoi, ik ben Clyde. Ik kan je ROI berekenen of de tiers doorlopen.',
  '/apply':
    'Hoi, ik ben Clyde. Vragen voordat je je aanmeldt? Stel ze gerust.',
  '/about': 'Hoi, ik ben Clyde. Wil je weten hoe ik werk?',
  default: 'Hoi, ik ben Clyde, je AI marketing medewerker. Wat heb je nodig?',
}

/**
 * Context-aware suggested prompts per page path. Keep to 4 prompts max
 * so the empty-state can render them as a 2x2 grid.
 */
const SUGGESTED_PROMPTS: Record<string, string[]> = {
  '/': [
    'Welke vaardigheden heb je?',
    'Laat me een demo zien',
    'Bereken mijn ROI',
    'Plan een gesprek',
  ],
  '/skills/social-media': [
    'Plan content voor volgende week',
    'Maak posts voor een skincare-merk',
    'Welke platforms dek je?',
    'Plan een gesprek',
  ],
  '/skills/voice-agent': [
    'Hoe neem je telefoons op?',
    'Laat een gespreksflow zien',
    'Welke talen ondersteun je?',
    'Plan een gesprek',
  ],
  '/skills/lead-qualifier': [
    'Score een voorbeeld-lead',
    'Hoe werkt kwalificatie?',
    'Toon scoring-criteria',
    'Plan een gesprek',
  ],
  '/pricing': [
    'Bereken ROI voor mijn bureau',
    'Vergelijk de tiers',
    'Wat zit er in Growth?',
    'Plan een gesprek',
  ],
  default: [
    'Welke vaardigheden heb je?',
    'Laat me een demo zien',
    'Bereken mijn ROI',
    'Plan een gesprek',
  ],
}

export function ChatWidgetIsland() {
  const pathname = usePathname()

  return (
    <ChatWidget
      mode="floating"
      personaId="clyde"
      personaName="Clyde"
      pageContext={{ pathname }}
      suggestedPrompts={SUGGESTED_PROMPTS[pathname] ?? SUGGESTED_PROMPTS.default}
      welcomeMessage={WELCOME_MESSAGES[pathname] ?? WELCOME_MESSAGES.default}
    />
  )
}

export default ChatWidgetIsland
