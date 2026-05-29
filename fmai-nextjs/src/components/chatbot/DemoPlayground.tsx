'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { PersonaSelector, DEMO_PERSONAS, type DemoPersonaId } from './PersonaSelector'
import { DemoContextCard } from './DemoContextCard'
import { ChatWidget } from './ChatWidget'
import { ProgressiveCTA } from './ProgressiveCTA'
import { useChatbotStore } from '@/stores/chatbotStore'
import { CLYDE_STARTERS } from '@/lib/chatbot/personas'

type DemoLocale = 'nl' | 'en' | 'es'

// Welcome bubble per demo tab, localized. The tab labels + context cards come
// from next-intl messages (chatbots.demo.tabs.*); these welcome lines are demo
// chrome that has no message key, so they live here.
const PERSONA_WELCOME: Record<DemoPersonaId, Record<DemoLocale, string>> = {
  ecommerce: {
    nl: 'Welkom! Ik ben Clyde, je onboarding-gids. Vertel me over het merk van je klant en ik laat zien hoe ik de merkstem, doelgroep en stijl leer.',
    en: "Welcome! I'm your Clyde onboarding guide. Tell me about your client's brand and I'll show you how I learn their voice, audience, and style.",
    es: '¡Bienvenido! Soy Clyde, tu guía de onboarding. Cuéntame sobre la marca de tu cliente y te mostraré cómo aprendo su voz, su audiencia y su estilo.',
  },
  leadgen: {
    nl: 'Hoi! Ik ben Clyde, de Lead Qualifier. Stel me een vraag zoals een websitebezoeker zou doen en ik laat zien hoe ik leads kwalificeer, score en naar je CRM route.',
    en: "Hi! I'm Clyde, the Lead Qualifier skill. Ask me a question like a website visitor would, and I'll show you how I qualify, score and route leads to CRM.",
    es: '¡Hola! Soy Clyde, el Lead Qualifier. Hazme una pregunta como lo haría un visitante de tu web y te mostraré cómo califico, puntúo y enruto leads a tu CRM.',
  },
  support: {
    nl: 'Hallo! Ik ben Clyde, de ROI-calculator. Vertel me over je bureau (teamgrootte, uurtarieven, aantal klanten) en ik schat je besparing in met Clyde aan je portfolio.',
    en: "Hello! I'm Clyde, the ROI Calculator. Tell me about your agency (team size, hourly rates, client count) and I'll estimate your savings with Clyde running your portfolio.",
    es: '¡Hola! Soy Clyde, la calculadora de ROI. Cuéntame sobre tu agencia (tamaño del equipo, tarifas por hora, número de clientes) y estimaré tu ahorro con Clyde gestionando tu portafolio.',
  },
  concierge: {
    nl: 'Hey! Ik ben Clyde, je FutureMarketingAI-concierge. Vraag me alles over de 12 vaardigheden, de tarieven of hoe Clyde in jouw klantportfolio past.',
    en: "Hey! I'm Clyde, your FutureMarketingAI Concierge. Ask me anything about the 12 skills, pricing tiers, or how Clyde fits your client portfolio.",
    es: '¡Hey! Soy Clyde, tu concierge de FutureMarketingAI. Pregúntame lo que sea sobre las 12 habilidades, las tarifas o cómo encaja Clyde en tu portafolio de clientes.',
  },
}

function normalizeDemoLocale(value: string): DemoLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
}

export function DemoPlayground() {
  const t = useTranslations('chatbots')
  const locale = normalizeDemoLocale(useLocale())
  const [activeTab, setActiveTab] = useState<DemoPersonaId>('ecommerce')
  const messageCounts = useChatbotStore((s) => s.messageCounts)

  return (
    <section id="demo-playground" className="py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">{t('demo.title')}</h2>
          <p className="text-text-quiet text-lg max-w-2xl mx-auto">{t('demo.subtitle')}</p>
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
                  personaName={t(`demo.tabs.${id}.label`)}
                  suggestedPrompts={CLYDE_STARTERS[locale] ?? CLYDE_STARTERS.nl}
                  welcomeMessage={PERSONA_WELCOME[id][locale]}
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
