'use client'

import { usePathname } from 'next/navigation'
import { ChatWidget } from './ChatWidget'

export function ChatWidgetIsland() {
  const pathname = usePathname()

  return (
    <ChatWidget
      mode="floating"
      personaId="flagship"
      personaName="FMai Concierge"
      pageContext={{ pathname }}
      suggestedPrompts={[
        'What services does FMai offer?',
        'Show me a case study',
        'Start guided demo',
      ]}
      welcomeMessage="Hi! I'm an AI assistant — the FMai Concierge. I can help you explore our skills, demo our AI agents, or book a discovery call. What would you like to know?"
    />
  )
}

export default ChatWidgetIsland
