import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Zap, Clock, Bot } from 'lucide-react'
import { useElevenLabsCall } from '../../hooks/useElevenLabsCall'
import { PhoneMockup } from './PhoneMockup'
import { VoiceDemoPhone } from './VoiceDemoPhone'

interface VoiceDemoSectionProps {
  sectionRef?: React.RefObject<HTMLElement>
}

const features = [
  { icon: Zap, text: 'Responds in <1 second' },
  { icon: Clock, text: 'Available 24/7' },
  { icon: Bot, text: 'Real AI — not a phone menu' },
]

export function VoiceDemoSection({ sectionRef }: VoiceDemoSectionProps) {
  const call = useElevenLabsCall()

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="py-16 px-12"
      id="live-demo"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
              <Phone className="w-4 h-4 text-accent-system" />
              <span className="text-sm font-medium text-text-secondary">Live Demo</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
              Talk to Our AI Agent
            </h2>

            <p className="text-lg text-text-muted leading-relaxed mb-8">
              Experience a real conversation with our AI voice agent. No signup required — just tap
              the button and start talking.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center gap-3 text-text-secondary">
                  <div className="w-8 h-8 rounded-lg bg-accent-system/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-accent-system" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 bg-white/[0.02] border border-border-primary rounded-card px-5 py-3 w-fit">
              <Phone className="w-4 h-4 text-accent-system" />
              <div>
                <p className="text-xs text-text-muted">Or call directly:</p>
                <a
                  href="tel:+15707838236"
                  className="text-sm font-semibold text-text-primary hover:text-accent-system transition-colors"
                >
                  +1 (570) 783-8236
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <PhoneMockup>
              <VoiceDemoPhone call={call} />
            </PhoneMockup>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
