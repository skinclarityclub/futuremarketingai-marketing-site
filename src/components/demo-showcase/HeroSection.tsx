import { motion } from 'framer-motion'
import { Zap, Bot, Phone, type LucideIcon } from 'lucide-react'

interface ServiceCard {
  id: string
  icon: LucideIcon
  title: string
  metric: string
}

const services: ServiceCard[] = [
  { id: 'automations', icon: Zap, title: 'AI Automations', metric: 'Bespaar 40+ uur/week' },
  { id: 'chatbots', icon: Bot, title: 'AI Chatbots', metric: '84% automatisch opgelost' },
  { id: 'voice', icon: Phone, title: 'AI Voice Agents', metric: '24/7, geen wachttijd' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection() {
  return (
    <section className="relative py-24 px-6 text-center">
      {/* Headline */}
      <motion.h1
        className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Stop met tijdverspilling. <span className="text-accent-system">Start met AI.</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="max-w-2xl mx-auto text-lg text-text-secondary mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Directe toegang tot een specialist die uw AI automations, chatbots en voice agents bouwt —
        geen standaard tools, geen DIY.
      </motion.p>

      {/* Service Cards */}
      <motion.div
        className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service) => {
          const Icon = service.icon
          return (
            <motion.button
              key={service.id}
              variants={cardVariants}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection(service.id)}
              className="group flex-1 cursor-pointer rounded-card border border-border-primary
                bg-bg-surface/80 backdrop-blur-md p-8
                transition-shadow duration-300 hover:shadow-glow-sm
                text-left"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-system/10">
                  <Icon className="w-5 h-5 text-accent-system" />
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  {service.title}
                </h3>
              </div>
              <p className="font-mono text-sm text-accent-system">{service.metric}</p>
            </motion.button>
          )
        })}
      </motion.div>
    </section>
  )
}
