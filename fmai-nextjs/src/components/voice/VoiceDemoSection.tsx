'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import { Phone, Zap, Clock, Bot } from 'lucide-react'
import { useElevenLabsCall } from '@/hooks/useElevenLabsCall'
import { PhoneMockup } from './PhoneMockup'
import { VoiceDemoPhone } from './VoiceDemoPhone'

interface VoiceDemoSectionProps {
  id?: string
}

// Set to a Vapi-provisioned NL DID once procured (e.g. `+31201234567`).
// While null the phone-display blocks are hidden and the web SDK demo carries the section.
const PHONE_NUMBER: string | null = null

const features = [
  { icon: Zap, text: 'Responds in <1 second' },
  { icon: Clock, text: 'Available 24/7' },
  { icon: Bot, text: 'Real AI -- not a phone menu' },
]

function formatPhoneDisplay(e164: string): string {
  if (e164.startsWith('+31')) {
    const rest = e164.slice(3).replace(/\D/g, '')
    if (rest.length === 9) return `+31 (0)${rest.slice(0, 1)} ${rest.slice(1, 5)} ${rest.slice(5)}`
    return `+31 ${rest}`
  }
  return e164
}

export function VoiceDemoSection({ id = 'live-demo' }: VoiceDemoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const call = useElevenLabsCall()

  return (
    <section ref={sectionRef} className="py-16 px-6 lg:px-12" id={id}>
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
              Experience a real conversation with our AI voice agent. No signup required -- just tap
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

            {PHONE_NUMBER && (
              <div className="flex items-center gap-3 bg-white/[0.02] border border-border-primary rounded-xl px-5 py-3 w-fit">
                <Phone className="w-4 h-4 text-accent-system" />
                <div>
                  <p className="text-xs text-text-muted">Or call directly:</p>
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="text-sm font-semibold text-text-primary hover:text-accent-system transition-colors"
                  >
                    {formatPhoneDisplay(PHONE_NUMBER)}
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {call.isAvailable ? (
              <PhoneMockup>
                <VoiceDemoPhone call={call} />
              </PhoneMockup>
            ) : (
              <div className="w-[292px] h-[520px] rounded-[2.5rem] border-[6px] border-zinc-700/80 bg-bg-deep flex flex-col items-center justify-center p-8 text-center">
                <Phone className="w-12 h-12 text-accent-system/40 mb-4" />
                <p className="text-text-secondary text-sm mb-2">
                  Voice demo temporarily unavailable
                </p>
                {PHONE_NUMBER ? (
                  <p className="text-text-muted text-xs">
                    Call us directly at{' '}
                    <a href={`tel:${PHONE_NUMBER}`} className="text-accent-system hover:underline">
                      {formatPhoneDisplay(PHONE_NUMBER)}
                    </a>
                  </p>
                ) : (
                  <p className="text-text-muted text-xs">
                    Email{' '}
                    <a href="mailto:hello@future-marketing.ai" className="text-accent-system hover:underline">
                      hello@future-marketing.ai
                    </a>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
