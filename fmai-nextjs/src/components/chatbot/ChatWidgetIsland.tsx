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
      welcomeMessage="Hi! I'm the FMai Concierge. I can help you explore our services, demo our AI chatbots, or book a discovery call. What would you like to know?"
    />
  )
}

export default ChatWidgetIsland
