'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from '@/i18n/navigation'
import { ChatWidget } from './ChatWidget'
import { ProactiveNudge } from './ProactiveNudge'
import { useChatbotStore } from '@/stores/chatbotStore'

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

/**
 * Proactive nudge prompts — shown as a bubble above the FAB after 40s
 * of inactivity on pages where Clyde has something specific to offer.
 * These are action-oriented: clicking sends the message to Clyde.
 */
const PROACTIVE_PROMPTS: Record<string, string> = {
  '/skills/voice-agent': 'Hoe neem je precies een telefoon op?',
  '/skills/social-media': 'Maak een content-plan voor mijn merk',
  '/skills/lead-qualifier': 'Score een voorbeeld-lead voor mij',
  '/skills/ad-creator': 'Genereer 3 ad-varianten voor mij',
  '/skills/email-management': 'Hoe filter je mijn inbox?',
  '/skills/reporting': 'Laat een weekrapport zien',
  '/skills/blog-factory': 'Plan een SEO-artikel voor mij',
  '/skills/clyde': 'Hoe werk je als orchestrator?',
  '/skills/research': 'Doe een marktonderzoek voor mij',
  '/skills/seo-geo': 'Hoe monitor je AI-citaties?',
  '/pricing': 'Bereken mijn ROI',
  '/about': 'Hoe werkt het platform precies?',
}

const NUDGE_DELAY_MS = 40_000

export function ChatWidgetIsland() {
  const pathname = usePathname()
  const isOpen = useChatbotStore((s) => s.isOpen)
  const toggle = useChatbotStore((s) => s.toggle)
  const sendChatMessage = useChatbotStore((s) => s.sendChatMessage)
  const messageCounts = useChatbotStore((s) => s.messageCounts)

  const [nudgeVisible, setNudgeVisible] = useState(false)
  const nudgePrompt = PROACTIVE_PROMPTS[pathname]

  // Reset nudge on page navigation
  useEffect(() => {
    setNudgeVisible(false)
  }, [pathname])

  // Hide nudge when chat opens
  useEffect(() => {
    if (isOpen) setNudgeVisible(false)
  }, [isOpen])

  // Proactive nudge: fire after NUDGE_DELAY_MS if user hasn't engaged
  useEffect(() => {
    if (!nudgePrompt) return
    const totalMessages = Object.values(messageCounts).reduce((a, b) => a + b, 0)
    if (totalMessages > 0 || isOpen) return
    const timer = setTimeout(() => setNudgeVisible(true), NUDGE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [nudgePrompt, messageCounts, isOpen, pathname])

  const handleNudgeAccept = useCallback(() => {
    setNudgeVisible(false)
    if (!isOpen) toggle()
    if (nudgePrompt) sendChatMessage(nudgePrompt)
  }, [isOpen, toggle, sendChatMessage, nudgePrompt])

  const handleNudgeDismiss = useCallback(() => {
    setNudgeVisible(false)
  }, [])

  // Keyboard shortcut: Ctrl+K / Cmd+K → open chat and focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        const active = document.activeElement
        // Don't hijack if user is typing in an unrelated input
        if (
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          (active instanceof HTMLElement && active.isContentEditable)
        ) {
          return
        }
        e.preventDefault()
        if (!isOpen) {
          toggle()
        } else {
          const textarea = document.querySelector<HTMLTextAreaElement>(
            '[data-chatwidget-panel] textarea'
          )
          textarea?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, toggle])

  return (
    <>
      <ProactiveNudge
        message={nudgePrompt ?? ''}
        visible={nudgeVisible}
        onAccept={handleNudgeAccept}
        onDismiss={handleNudgeDismiss}
      />
      <ChatWidget
        mode="floating"
        personaId="clyde"
        personaName="Clyde"
        pageContext={{ pathname }}
        suggestedPrompts={SUGGESTED_PROMPTS[pathname] ?? SUGGESTED_PROMPTS.default}
        welcomeMessage={WELCOME_MESSAGES[pathname] ?? WELCOME_MESSAGES.default}
      />
    </>
  )
}

export default ChatWidgetIsland
