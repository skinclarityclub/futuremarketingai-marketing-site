'use client'

import { motion } from 'motion/react'
import { Check, ArrowRight, Zap, Bot, BarChart3, Megaphone } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export interface ServiceCardData {
  name: string
  description?: string
  features?: string[]
  highlights?: string[]
  price?: string
  starting_price?: string
  url?: string
  services?: ServiceCardData[] | Record<string, ServiceCardData>
  tiers?:
    | { name: string; price: string; features: string[]; highlighted?: boolean }[]
    | Record<
        string,
        {
          name: string
          monthlyPrice?: number
          annualPrice?: number
          price?: string
          features: string[]
          highlighted?: boolean
        }
      >
  module?: string | { name: string; description?: string; features?: string[]; icon?: string }
  benefits?: string[]
  metrics?: { label: string; value: string }[]
}

const SERVICE_ICONS: Record<string, typeof Zap> = {
  chatbot: Bot,
  'ai chatbot': Bot,
  voice: Megaphone,
  'voice agent': Megaphone,
  automation: Zap,
  marketing: BarChart3,
  'marketing machine': BarChart3,
}

function getServiceIcon(name?: string) {
  if (!name) return Zap
  const lower = name.toLowerCase()
  for (const [key, Icon] of Object.entries(SERVICE_ICONS)) {
    if (lower.includes(key)) return Icon
  }
  return Zap
}

function SingleServiceCard({ data, index }: { data: ServiceCardData; index?: number }) {
  const Icon = getServiceIcon(data.name)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index ?? 0) * 0.08, duration: 0.25 }}
      className="rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md transition-colors duration-200 hover:border-accent-system/30"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-system/15">
          <Icon className="h-4 w-4 text-accent-system" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold text-text-primary">
            {data.name || 'Service'}
          </p>
          {data.description && (
            <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{data.description}</p>
          )}
        </div>
      </div>
      {data.features && data.features.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {data.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-success" />
              {feature}
            </li>
          ))}
        </ul>
      )}
      {data.price && (
        <div className="mt-3 flex items-center justify-between">
          <p className="font-mono text-sm font-bold text-accent-human">{data.price}</p>
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent-system hover:underline"
            >
              Learn more <ArrowRight className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

function PricingTier({
  tier,
  index,
}: {
  tier: { name: string; price: string; features: string[]; highlighted?: boolean }
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.25 }}
      className={`rounded-xl border p-4 ${tier.highlighted ? 'border-accent-system/40 bg-accent-system/5 ring-1 ring-accent-system/20' : 'border-border-primary bg-bg-elevated/80'}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-sans text-sm font-semibold text-text-primary">{tier.name}</p>
        {tier.highlighted && (
          <span className="rounded-full bg-accent-system/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-system">
            Popular
          </span>
        )}
      </div>
      <p className="mt-1 font-mono text-lg font-bold text-accent-human">{tier.price}</p>
      <ul className="mt-3 space-y-1.5">
        {tier.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-success" />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export function ServiceCard({ data }: { data: ServiceCardData }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let normalizedTiers:
    | { name: string; price: string; features: string[]; highlighted?: boolean }[]
    | undefined
  if (data.tiers) {
    if (Array.isArray(data.tiers)) {
      normalizedTiers = data.tiers
    } else if (typeof data.tiers === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      normalizedTiers = Object.values(data.tiers).map((tier: any) => ({
        name: tier.name || 'Plan',
        price:
          typeof tier.price === 'string'
            ? tier.price
            : tier.monthlyPrice !== null && tier.monthlyPrice !== undefined
              ? `\u20AC${tier.monthlyPrice}/mo`
              : tier.annualPrice !== null && tier.annualPrice !== undefined
                ? `\u20AC${tier.annualPrice}/yr`
                : 'Custom',
        features: tier.features || [],
        highlighted: tier.highlighted,
      }))
    }
  }

  if (normalizedTiers && normalizedTiers.length > 0) {
    return (
      <div className="w-full space-y-3">
        <p className="font-sans text-sm font-semibold text-text-primary">Pricing Plans</p>
        {normalizedTiers.map((tier, i) => (
          <PricingTier key={tier.name} tier={tier} index={i} />
        ))}
        <Link
          href="/contact"
          className="block rounded-xl bg-gradient-to-r from-accent-system to-accent-secondary px-4 py-3 text-center text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          Get a custom quote
        </Link>
      </div>
    )
  }

  let moduleName: string | undefined
  let moduleDescription = data.description
  let moduleFeatures = data.features
  if (data.module) {
    if (typeof data.module === 'object') {
      moduleName = data.module.name
      moduleDescription = data.module.description || data.description
      moduleFeatures = data.module.features || data.features
    } else {
      moduleName = data.module
    }
  }

  if (moduleName || data.metrics) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full space-y-3"
      >
        <div className="rounded-xl border border-accent-system/20 bg-accent-system/5 p-4">
          <p className="font-sans text-sm font-semibold text-text-primary">
            {moduleName || data.name}
          </p>
          {moduleDescription && (
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">{moduleDescription}</p>
          )}
        </div>
        {data.metrics && data.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {data.metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.2 }}
                className="rounded-lg border border-border-primary bg-bg-elevated/80 p-3 text-center"
              >
                <p className="font-mono text-lg font-bold text-accent-system">{m.value}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-text-secondary">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}
        {data.benefits && data.benefits.length > 0 && (
          <ul className="space-y-1.5 px-1">
            {data.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-success" />
                {b}
              </li>
            ))}
          </ul>
        )}
        {moduleFeatures && moduleFeatures.length > 0 && (
          <ul className="space-y-1.5 px-1">
            {moduleFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-success" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let normalizedServices: ServiceCardData[] | undefined
  if (data.services) {
    if (Array.isArray(data.services)) {
      normalizedServices = data.services
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else if (typeof data.services === 'object') {
      normalizedServices = Object.values(data.services).map((svc: any) => ({
        name: svc.name || 'Service',
        description: svc.description,
        features: svc.features || svc.highlights || [],
        price: svc.price || svc.starting_price,
      }))
    }
  }

  if (normalizedServices && normalizedServices.length > 0) {
    return (
      <div className="w-full space-y-3">
        <p className="font-sans text-sm font-semibold text-text-primary">Our Services</p>
        {normalizedServices.map((service, i) => (
          <SingleServiceCard key={service.name || i} data={service} index={i} />
        ))}
        <Link
          href="/contact"
          className="block rounded-xl bg-gradient-to-r from-accent-system to-accent-secondary px-4 py-3 text-center text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          Book a discovery call
        </Link>
      </div>
    )
  }

  const normalizedData: ServiceCardData = {
    ...data,
    features: data.features || data.highlights,
    price: data.price || data.starting_price,
  }
  return (
    <div className="my-2">
      <SingleServiceCard data={normalizedData} />
    </div>
  )
}

export default ServiceCard
