import { motion } from 'framer-motion'
import { Bot, Phone, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const services = [
  {
    id: 'chatbots',
    icon: Bot,
    title: 'AI Chatbots',
    metric: '84% of questions auto-resolved',
    description:
      'Custom-trained chatbots die uw klanten 24/7 helpen. Getraind op uw kennisbank, geïntegreerd met uw CRM.',
    cta: 'Probeer de live demo',
    link: '/chatbots',
  },
  {
    id: 'voice',
    icon: Phone,
    title: 'AI Voice Agents',
    metric: 'Zero hold time, 24/7 beschikbaar',
    description:
      'AI-gestuurde telefonisten die inbound en outbound calls afhandelen. Natuurlijke gesprekken, directe actie.',
    cta: 'Bel onze AI',
    link: '/voice-agents',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export default function ServicePreview() {
  return (
    <div className="flex flex-col gap-8">
      {services.map((service, index) => {
        const Icon = service.icon
        return (
          <motion.section
            key={service.id}
            id={service.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
            className="rounded-card border border-border-primary bg-bg-surface/60 p-8 backdrop-blur-md"
          >
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              {/* Content */}
              <div className="flex flex-1 items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-system/10">
                  <Icon className="h-7 w-7 text-accent-system" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-text-primary">
                    {service.title}
                  </h3>
                  <p className="font-mono text-sm text-accent-system">{service.metric}</p>
                  <p className="max-w-lg text-text-secondary">{service.description}</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={service.link}
                className="inline-flex shrink-0 items-center gap-2 rounded-btn bg-accent-system px-6 py-3 font-medium text-bg-deep transition-all duration-300 hover:scale-105 hover:shadow-glow active:scale-95"
              >
                {service.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.section>
        )
      })}
    </div>
  )
}
