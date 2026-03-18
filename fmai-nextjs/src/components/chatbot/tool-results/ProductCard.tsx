'use client'

import { Star } from 'lucide-react'

export interface ProductCardData {
  name?: string
  price?: string | number
  currency?: string
  image?: string
  rating?: number
  description?: string
  url?: string
  products?: ProductCardData[]
  morning?: { step: string; product: { id: string; name: string; price: number } }[]
  evening?: { step: string; product: { id: string; name: string; price: number } }[]
}

function formatPrice(price: string | number | undefined, currency?: string): string | null {
  if (price === undefined || price === null) {
    return null
  }
  const curr = currency ?? '\u20AC'
  if (typeof price === 'number') {
    return `${curr}${price.toFixed(2)}`
  }
  return `${curr}${price}`
}

function SingleProduct({ data }: { data: ProductCardData }) {
  const Wrapper = data.url ? 'a' : 'div'
  const wrapperProps = data.url
    ? { href: data.url, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}
  const priceStr = formatPrice(data.price, data.currency)

  return (
    <Wrapper
      {...wrapperProps}
      className={`block w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md transition-colors duration-200 hover:border-accent-system/30${data.url ? ' cursor-pointer' : ''}`}
      style={{ animation: 'fadeIn 0.3s ease-in' }}
    >
      {data.image && (
        <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-bg-elevated">
          <span className="font-sans text-xs text-text-secondary">{data.name}</span>
        </div>
      )}
      {data.name && <p className="font-sans text-sm font-medium text-text-primary">{data.name}</p>}
      {priceStr && <p className="mt-1 font-mono text-lg text-accent-system">{priceStr}</p>}
      {data.rating !== undefined && (
        <div className="mt-1.5 flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.round(data.rating!) ? 'fill-accent-human text-accent-human' : 'text-text-secondary/30'}`}
            />
          ))}
        </div>
      )}
      {data.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary">{data.description}</p>
      )}
      {data.url && (
        <span className="mt-2 inline-block text-xs text-accent-system hover:underline">
          View Details
        </span>
      )}
    </Wrapper>
  )
}

function RoutineSection({
  title,
  steps,
}: {
  title: string
  steps: { step: string; product: { id: string; name: string; price: number } }[]
}) {
  return (
    <div className="space-y-2">
      <p className="font-sans text-xs font-semibold uppercase tracking-wider text-accent-system">
        {title}
      </p>
      {steps.map((s, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-elevated/60 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-system/20 text-[10px] font-bold text-accent-system">
              {i + 1}
            </span>
            <div>
              <p className="text-xs font-medium text-text-primary">{s.product.name}</p>
              <p className="text-[10px] text-text-secondary">{s.step}</p>
            </div>
          </div>
          <p className="font-mono text-xs text-accent-system">
            {'\u20AC'}
            {s.product.price.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  )
}

export function ProductCard({ data }: { data: ProductCardData }) {
  if (data.morning || data.evening) {
    return (
      <div className="my-2 w-full space-y-4 rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md">
        <p className="font-sans text-sm font-semibold text-text-primary">Your Skincare Routine</p>
        {data.morning && <RoutineSection title="Morning" steps={data.morning} />}
        {data.evening && <RoutineSection title="Evening" steps={data.evening} />}
      </div>
    )
  }

  if (data.products && Array.isArray(data.products)) {
    return (
      <div className="my-2 space-y-2">
        {data.products.map((product, i) => (
          <SingleProduct key={product.name || i} data={product} />
        ))}
      </div>
    )
  }

  return (
    <div className="my-2">
      <SingleProduct data={data} />
    </div>
  )
}

export default ProductCard
