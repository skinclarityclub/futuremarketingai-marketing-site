import { useTranslation } from 'react-i18next'
import { PersonaSelector, DEMO_PERSONAS, type DemoPersonaId } from './PersonaSelector'
import { DemoContextCard } from './DemoContextCard'
import { ChatWidget } from './ChatWidget'
import {
  ECOMMERCE_STARTERS,
  LEADGEN_STARTERS,
  SUPPORT_STARTERS,
  CONCIERGE_STARTERS,
} from '../../lib/chatbot/personas'

const PERSONA_STARTERS: Record<DemoPersonaId, Record<string, string[]>> = {
  ecommerce: ECOMMERCE_STARTERS,
  leadgen: LEADGEN_STARTERS,
  support: SUPPORT_STARTERS,
  concierge: CONCIERGE_STARTERS,
}

const PERSONA_NAMES: Record<DemoPersonaId, string> = {
  ecommerce: 'E-commerce Advisor',
  leadgen: 'Lead Qualifier',
  support: 'Support Agent',
  concierge: 'Website Concierge',
}

const PERSONA_WELCOME: Record<DemoPersonaId, string> = {
  ecommerce:
    "Hi there! I'm your skincare advisor. Tell me about your skin type and I'll recommend the perfect products for you.",
  leadgen:
    "Hello! I'm here to help you find the right AI solution for your business. What are you looking to achieve?",
  support:
    "Hi! I'm your support agent. How can I help you today? I can check orders, answer questions, or create a ticket.",
  concierge:
    "Hey! I'm the FMai Concierge — ask me anything about our services, pricing, or how AI can transform your marketing.",
}

interface DemoPlaygroundProps {
  activeTab: DemoPersonaId
  onTabChange: (id: DemoPersonaId) => void
}

export function DemoPlayground({ activeTab, onTabChange }: DemoPlaygroundProps) {
  const { t, i18n } = useTranslation('chatbots')
  const lang = i18n.language || 'en'

  return (
    <section id="demo-playground" className="py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-3">
            {t('demo.title')}
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('demo.subtitle')}</p>
        </div>

        <PersonaSelector active={activeTab} onChange={onTabChange} />

        <div className="flex flex-col lg:flex-row gap-6">
          <DemoContextCard personaId={activeTab} />

          <div className="w-full lg:w-[70%]">
            {DEMO_PERSONAS.map((id) => (
              <div key={id} className={activeTab === id ? 'block' : 'hidden'}>
                <ChatWidget
                  mode="embedded"
                  personaId={id}
                  personaName={PERSONA_NAMES[id]}
                  suggestedPrompts={PERSONA_STARTERS[id][lang] || PERSONA_STARTERS[id].en}
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
