'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PersonaSelector, DEMO_PERSONAS, type DemoPersonaId } from './PersonaSelector'
import { DemoContextCard } from './DemoContextCard'
import { ChatWidget } from './ChatWidget'
import { ECOMMERCE_STARTERS, LEADGEN_STARTERS, SUPPORT_STARTERS } from '@/lib/chatbot/personas'

const PERSONA_STARTERS: Record<DemoPersonaId, Record<string, string[]>> = {
  ecommerce: ECOMMERCE_STARTERS,
  leadgen: LEADGEN_STARTERS,
  support: SUPPORT_STARTERS,
}

const PERSONA_NAMES: Record<DemoPersonaId, string> = {
  ecommerce: 'E-commerce Advisor',
  leadgen: 'Lead Qualifier',
  support: 'Support Agent',
}

const PERSONA_WELCOME: Record<DemoPersonaId, string> = {
  ecommerce:
    "Hi there! I'm your skincare advisor. Tell me about your skin type and I'll recommend the perfect products for you.",
  leadgen:
    "Hello! I'm here to help you find the right AI solution for your business. What are you looking to achieve?",
  support:
    "Hi! I'm your support agent. How can I help you today? I can check orders, answer questions, or create a ticket.",
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
