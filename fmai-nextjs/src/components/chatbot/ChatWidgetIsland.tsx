'use client'

import { usePathname } from 'next/navigation'
import { ChatWidget } from './ChatWidget'

/** Context-aware welcome messages per page path */
const WELCOME_MESSAGES: Record<string, string> = {
  '/': "I'm Clyde. Ask me anything about what I can do for your agency.",
  '/skills/social-media': "I'm Clyde. Want me to create a content calendar for one of your clients?",
  '/skills/voice-agent':
    "I'm Clyde. I can show you how I handle phone calls, or answer any questions.",
  '/skills/lead-qualifier':
    "I'm Clyde. You're chatting with me right now. This is exactly what your clients would get on their site.",
  '/skills/ad-creator': "I'm Clyde. I can generate ad variations from any campaign brief.",
  '/skills/email-management':
    "I'm Clyde. I classify your Gmail inbox and send daily digests of what matters.",
  '/skills/reporting': "I'm Clyde. I can show you what a weekly performance report looks like.",
  '/pricing': "I'm Clyde. I can calculate your ROI or walk you through the tiers.",
  '/apply': "I'm Clyde. Any questions before you fill in the application?",
  '/about': "I'm Clyde. Want to know more about how I work?",
  default: "I'm Clyde, your AI marketing employee. What do you need?",
}

/** Context-aware suggested prompts per page path */
const SUGGESTED_PROMPTS: Record<string, string[]> = {
  '/': ['What skills do you have?', 'Show me a demo', 'Calculate my ROI', 'Book a partnership call'],
  '/skills/social-media': [
    'Plan next week\'s content',
    'Create social posts for a skincare brand',
    'What platforms do you cover?',
  ],
  '/skills/voice-agent': [
    'How do you handle calls?',
    'Show me a call script',
    'What languages do you support?',
  ],
  '/skills/lead-qualifier': [
    'Score a sample lead',
    'How does qualification scoring work?',
    'Show qualification criteria',
  ],
  '/pricing': ['Calculate ROI for my agency', 'Compare tiers', 'What is included in Growth?'],
  default: [
    'What skills do you have?',
    'Show me a demo',
    'Calculate my ROI',
    'Book a partnership call',
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
