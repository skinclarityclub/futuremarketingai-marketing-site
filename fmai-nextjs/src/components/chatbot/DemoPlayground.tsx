'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PersonaSelector, DEMO_PERSONAS, type DemoPersonaId } from './PersonaSelector'
import { DemoContextCard } from './DemoContextCard'
import { ChatWidget } from './ChatWidget'
import {
  ECOMMERCE_STARTERS,
  LEADGEN_STARTERS,
  SUPPORT_STARTERS,
  CONCIERGE_STARTERS,
} from '@/lib/chatbot/personas'

const PERSONA_STARTERS: Record<DemoPersonaId, Record<string, string[]>> = {
  ecommerce: ECOMMERCE_STARTERS,
  leadgen: LEADGEN_STARTERS,
  support: SUPPORT_STARTERS,
  concierge: CONCIERGE_STARTERS,
}

const PERSONA_NAMES: Record<DemoPersonaId, string> = {
  ecommerce: 'Onboarding Assistant',
  leadgen: 'Content Creator',
  support: 'ROI Calculator',
  concierge: 'Website Concierge',
}

const PERSONA_WELCOME: Record<DemoPersonaId, string> = {
  ecommerce:
    "Welcome! I'm an AI assistant — your AI Marketing Employee onboarding guide. Tell me about your client's brand and I'll show you how I learn their voice, audience, and style.",
  leadgen:
    "Hi! I'm an AI assistant — the Content Creator skill. Give me a topic and a client brief, and I'll draft an SEO-optimized blog post tailored to their brand voice.",
  support:
    "Hello! I'm an AI assistant — the ROI Calculator. Tell me about your agency — team size, hourly rates, and client count — and I'll estimate your savings with an AI Marketing Employee.",
  concierge:
    "Hey! I'm an AI assistant — the FMai Concierge. Ask me anything about our services, pricing, or how AI can transform your marketing.",
}

export function DemoPlayground() {
  const t = useTranslations('chatbots')
  const [activeTab, setActiveTab] = useState<DemoPersonaId>('ecommerce')

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
                  personaId={id}
                  personaName={PERSONA_NAMES[id]}
                  suggestedPrompts={PERSONA_STARTERS[id]?.en || []}
                  welcomeMessage={PERSONA_WELCOME[id]}
                  height="550px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export type { DemoPersonaId }
