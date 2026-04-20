'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PersonaSelector, DEMO_PERSONAS, type DemoPersonaId } from './PersonaSelector'
import { DemoContextCard } from './DemoContextCard'
import { ChatWidget } from './ChatWidget'
import { ProgressiveCTA } from './ProgressiveCTA'
import { useChatbotStore } from '@/stores/chatbotStore'
import { CLYDE_STARTERS } from '@/lib/chatbot/personas'

const PERSONA_STARTERS: Record<DemoPersonaId, Record<string, string[]>> = {
  ecommerce: CLYDE_STARTERS,
  leadgen: CLYDE_STARTERS,
  support: CLYDE_STARTERS,
  concierge: CLYDE_STARTERS,
}

const PERSONA_NAMES: Record<DemoPersonaId, string> = {
  ecommerce: 'Onboarding Assistant',
  leadgen: 'Lead Qualifier',
  support: 'ROI Calculator',
  concierge: 'Website Concierge',
}

const PERSONA_WELCOME: Record<DemoPersonaId, string> = {
  ecommerce:
    "Welcome! I'm your Clyde onboarding guide. Tell me about your client's brand and I'll show you how I learn their voice, audience, and style.",
  leadgen:
    "Hi! I'm Clyde, the Lead Qualifier skill. Ask me a question like a website visitor would, and I'll show you how I qualify, score and route leads to CRM.",
  support:
    "Hello! I'm Clyde, the ROI Calculator. Tell me about your agency (team size, hourly rates, client count) and I'll estimate your savings with Clyde running your portfolio.",
  concierge:
    "Hey! I'm Clyde, your FutureMarketingAI Concierge. Ask me anything about the 12 skills, pricing tiers, or how Clyde fits your client portfolio.",
}

export function DemoPlayground() {
  const t = useTranslations('chatbots')
  const [activeTab, setActiveTab] = useState<DemoPersonaId>('ecommerce')
  const messageCounts = useChatbotStore((s) => s.messageCounts)

  return (
    <section id="demo-playground" className="py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">{t('demo.title')}</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{t('demo.subtitle')}</p>
        </div>

        <PersonaSelector active={activeTab} onChange={setActiveTab} />

        <div className="flex flex-col lg:flex-row gap-6">
          <DemoContextCard personaId={activeTab} />

          <div className="w-full lg:w-[70%]">
            {DEMO_PERSONAS.map((id) => (
              <div key={id} className={activeTab === id ? 'block' : 'hidden'}>
                <ChatWidget
                  mode="embedded"
                  personaId="clyde"
                  personaName={PERSONA_NAMES[id]}
                  suggestedPrompts={PERSONA_STARTERS[id]?.en || []}
                  welcomeMessage={PERSONA_WELCOME[id]}
                  height="550px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progressive CTA -- appears based on message count */}
        <ProgressiveCTA messageCount={messageCounts[activeTab] || 0} />
      </div>
    </section>
  )
}

export type { DemoPersonaId }
