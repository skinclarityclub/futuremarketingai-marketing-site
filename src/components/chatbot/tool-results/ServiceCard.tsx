import { Check } from 'lucide-react'

export interface ServiceCardData {
  name: string
  description?: string
  features?: string[]
  price?: string
  url?: string
}

export function ServiceCard({ data }: { data: ServiceCardData }) {
  const Wrapper = data.url ? 'a' : 'div'
  const wrapperProps = data.url
    ? { href: data.url, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`my-2 block w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md transition-colors duration-200 hover:border-accent-system/30${data.url ? ' cursor-pointer' : ''}`}
      style={{ animation: 'fadeIn 0.3s ease-in' }}
    >
      {/* Service name */}
      <p className="font-sans text-sm font-medium text-text-primary">{data.name}</p>

      {/* Description */}
      {data.description && <p className="mt-1 text-xs text-text-secondary">{data.description}</p>}

      {/* Features */}
      {data.features && data.features.length > 0 && (
        <ul className="mt-2 space-y-1">
          {data.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-system" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Price */}
      {data.price && <p className="mt-2 font-mono text-sm text-accent-human">{data.price}</p>}

      {/* CTA */}
      {data.url && (
        <span className="mt-2 inline-block text-xs text-accent-system hover:underline">
          Learn More
        </span>
      )}
    </Wrapper>
  )
}

export default ServiceCard
