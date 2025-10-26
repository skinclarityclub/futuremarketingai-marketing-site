/**
 * ResponsiveImage - Optimized image component for mobile-first approach
 *
 * Features:
 * - Automatic srcset generation for multiple screen sizes
 * - WebP with fallback support
 * - Lazy loading with intersection observer
 * - Priority loading for above-fold images
 * - Proper aspect ratio handling
 * - WCAG compliant alt text
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export interface ResponsiveImageProps {
  /** Base image src (will be used for srcset generation) */
  src: string
  /** Alt text for accessibility (required) */
  alt: string
  /** Image width in pixels (for aspect ratio) */
  width: number
  /** Image height in pixels (for aspect ratio) */
  height: number
  /** Priority loading (for above-fold images) */
  priority?: boolean
  /** CSS class name */
  className?: string
  /** Sizes attribute for responsive images */
  sizes?: string
  /** Object fit behavior */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  /** Callback when image loads */
  onLoad?: () => void
  /** Callback when image fails to load */
  onError?: () => void
}

/**
 * Generate srcset for different screen sizes
 * Assumes images are stored in /images/ with size suffixes
 */
function generateSrcSet(baseSrc: string): string {
  // Extract filename without extension
  const lastDot = baseSrc.lastIndexOf('.')
  const filename = baseSrc.substring(0, lastDot)
  const ext = baseSrc.substring(lastDot)

  // Generate srcset for common device sizes
  const sizes = [320, 640, 768, 1024, 1280, 1536]
  return sizes
    .map((size) => `${filename}-${size}w${ext} ${size}w`)
    .join(', ')
}

/**
 * Check if WebP is supported
 */
function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  if (canvas.getContext && canvas.getContext('2d')) {
    // Check if webp is supported
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }
  return false
}

/**
 * Simple intersection observer hook (no external dependency)
 */
function useInView(options: { skip?: boolean; threshold?: number }) {
  const [inView, setInView] = useState(options.skip || false)
  const ref = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (options.skip || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: options.threshold || 0.1 }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [options.skip, options.threshold])

  return { ref, inView }
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  objectFit = 'cover',
  onLoad,
  onError,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [webpSupported, setWebpSupported] = useState(false)

  // Use intersection observer for lazy loading (unless priority)
  const { ref, inView } = useInView({
    skip: priority,
    threshold: 0.1,
  })

  // Check WebP support on mount
  useEffect(() => {
    setWebpSupported(supportsWebP())
  }, [])

  // Generate WebP source if supported
  const webpSrc = webpSupported && src.match(/\.(jpg|jpeg|png)$/i)
    ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    : null

  // Determine if image should load
  const shouldLoad = priority || inView

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  // Handle image error
  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  // Calculate aspect ratio padding
  const aspectRatio = (height / width) * 100

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        paddingBottom: `${aspectRatio}%`,
      }}
    >
      {/* Placeholder skeleton while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse" />
      )}

      {/* Actual image (lazy loaded via intersection observer) */}
      {shouldLoad && (
        <picture>
          {/* WebP source if supported */}
          {webpSrc && (
            <source
              type="image/webp"
              srcSet={generateSrcSet(webpSrc)}
              sizes={sizes}
            />
          )}

          {/* Fallback image */}
          <img
            ref={ref}
            src={src}
            srcSet={generateSrcSet(src)}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`
              absolute inset-0 w-full h-full
              transition-opacity duration-300
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              ${hasError ? 'hidden' : ''}
            `}
            style={{
              objectFit,
            }}
          />
        </picture>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 text-white text-sm">
          <div className="text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-slate-400">Image failed to load</p>
          </div>
        </div>
      )}
    </div>
  )
}

ResponsiveImage.displayName = 'ResponsiveImage'

