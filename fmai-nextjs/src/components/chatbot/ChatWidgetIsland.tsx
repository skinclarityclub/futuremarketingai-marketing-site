'use client'

import { usePathname } from 'next/navigation'
import { ChatWidget } from './ChatWidget'

/** Context-aware welcome messages per page path */
const WELCOME_MESSAGES: Record<string, string> = {
  '/': "I'm Clyde. Ask me anything about what I can do for your agency.",
  '/skills/content-creator': "I'm Clyde. Want to see me write content for one of your clients?",
  '/skills/voice-agent':
    "I'm Clyde. I can show you how I handle phone calls — or answer any questions.",
  '/skills/chatbot':
    "I'm Clyde. You're chatting with me right now. This is exactly what your clients get.",
  '/skills/lead-qualifier': "I'm Clyde. Let me show you how I score and qualify leads.",
  '/skills/social-media': "I'm Clyde. Want me to create a content calendar for your client?",
  '/skills/ad-creator': "I'm Clyde. I can generate ad variations from any campaign brief.",
  '/skills/email': "I'm Clyde. I handle email campaigns, follow-ups, and inbox management.",
  '/skills/reporting': "I'm Clyde. I can show you what a weekly performance report looks like.",
  '/pricing': "I'm Clyde. I can calculate your ROI or walk you through the tiers.",
  '/about': "I'm Clyde. Want to know more about how I work?",
  default: "I'm Clyde, your AI marketing employee. What do you need?",
}

/** Context-aware suggested prompts per page path */
const SUGGESTED_PROMPTS: Record<string, string[]> = {
  '/': ['What skills do you have?', 'Show me a demo', 'Calculate my ROI', 'Book a strategy call'],
  '/skills/content-creator': [
    'Write a blog post about SEO',
    'Create social posts for a restaurant',
    "Plan next week's content",
  ],
  '/skills/voice-agent': [
    'How do you handle calls?',
    'Show me a call script',
    'What languages do you support?',
  ],
  '/skills/chatbot': [
    'Show me your capabilities',
    'How are you trained?',
    'Deploy a chatbot for my client',
  ],
  '/skills/lead-qualifier': [
    'Score a sample lead',
    'How does BANT scoring work?',
    'Show qualification criteria',
  ],
  '/pricing': ['Calculate ROI for my agency', 'Compare tiers', "What's included in Growth?"],
  default: [
    'What skills do you have?',
    'Show me a demo',
    'Calculate my ROI',
    'Book a strategy call',
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
