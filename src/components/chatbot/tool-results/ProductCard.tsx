import { Star } from 'lucide-react'

export interface ProductCardData {
  name: string
  price?: string
  currency?: string
  image?: string
  rating?: number
  description?: string
  url?: string
}

export function ProductCard({ data }: { data: ProductCardData }) {
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
      {/* Image placeholder */}
      {data.image && (
        <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-bg-elevated">
          <span className="font-sans text-xs text-text-secondary">{data.name}</span>
        </div>
      )}

      {/* Product name */}
      <p className="font-sans text-sm font-medium text-text-primary">{data.name}</p>

      {/* Price */}
      {data.price && (
        <p className="mt-1 font-mono text-lg text-accent-system">
          {data.currency ?? '$'}
          {data.price}
        </p>
      )}

      {/* Rating */}
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

      {/* Description */}
      {data.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary">{data.description}</p>
      )}

      {/* CTA */}
      {data.url && (
        <span className="mt-2 inline-block text-xs text-accent-system hover:underline">
          View Details
        </span>
      )}
    </Wrapper>
  )
}

export default ProductCard
