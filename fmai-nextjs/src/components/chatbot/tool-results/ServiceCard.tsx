'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { useCardCopy } from './cardI18n'
import { CardFooter, CardShell, CardTitle, Dot } from './CardShell'

export interface ServiceCardData {
  name: string
  description?: string
  features?: string[]
  highlights?: string[]
  price?: string
  starting_price?: string
  url?: string
  status?: 'live' | 'coming_soon'
  services?: ServiceCardData[] | Record<string, ServiceCardData>
  tiers?:
    | {
        name: string
        price: string
        features: string[]
        highlighted?: boolean
      }[]
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
  module?:
    | string
    | {
        name: string
        description?: string
        features?: string[]
        icon?: string
      }
  benefits?: string[]
  metrics?: { label: string; value: string }[]
}

type Tier = {
  name: string
  price: string
  features: string[]
  highlighted?: boolean
}

function ServiceRow({ service }: { service: ServiceCardData }) {
  const { t } = useCardCopy()
  return (
    <li className="relative pl-4 leading-[1.45]">
      <Dot />
      <span className="font-medium text-text-primary">{service.name || 'Service'}</span>
      {service.status === 'coming_soon' && (
        <span className="ml-2 rounded-full bg-accent-human/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-human">
          {t.comingSoon}
        </span>
      )}
      {service.description && <span className="block">{service.description}</span>}
    </li>
  )
}

function TierRow({ tier }: { tier: Tier }) {
  const { t } = useCardCopy()
  return (
    <li
      className={`relative pl-4 leading-[1.45] ${tier.highlighted ? 'rounded-lg bg-accent-system/5 py-1 pr-2' : ''}`}
    >
      <Dot />
      <span className="font-medium text-text-primary">{tier.name}</span>
      {tier.highlighted && (
        <span className="ml-2 rounded-full bg-accent-system/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-system">
          {t.popular}
        </span>
      )}
      <span className="block font-mono text-accent-human">{tier.price}</span>
      {tier.features[0] && <span className="block">{tier.features[0]}</span>}
    </li>
  )
}

export function ServiceCard({ data }: { data: ServiceCardData }) {
  const { t } = useCardCopy()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let normalizedTiers: Tier[] | undefined
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
      <CardShell>
        <CardTitle title={t.pricingHeader} />
        <ul className="flex list-none flex-col gap-2 p-0">
          {normalizedTiers.map((tier) => (
            <TierRow key={tier.name} tier={tier} />
          ))}
        </ul>
        <CardFooter href="/pricing" label={t.allPricing} />
      </CardShell>
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
    } else if (typeof data.services === 'object') {
      normalizedServices = Object.values(data.services as Record<string, unknown>).map((raw) => {
        const svc = raw as Record<string, unknown>
        return {
          name: (svc.name as string) || 'Service',
          description: svc.description as string | undefined,
          features:
            (svc.features as string[] | undefined) ||
            (svc.highlights as string[] | undefined) ||
            [],
          price: (svc.price as string | undefined) || (svc.starting_price as string | undefined),
          url: svc.url as string | undefined,
          status: svc.status as 'live' | 'coming_soon' | undefined,
        }
      })
    }
  }

  if (normalizedServices && normalizedServices.length > 0) {
    return (
      <CardShell>
        <CardTitle title={t.skillsHeader} />
        <ul className="flex list-none flex-col gap-2 p-0">
          {normalizedServices.slice(0, 5).map((service, i) => (
            <ServiceRow key={service.name || i} service={service} />
          ))}
        </ul>
        <CardFooter href="/skills" label={t.allSkills} />
      </CardShell>
    )
  }

  return (
    <CardShell>
      <ul className="flex list-none flex-col gap-2 p-0">
        <ServiceRow service={data} />
      </ul>
    </CardShell>
  )
}

export default ServiceCard
