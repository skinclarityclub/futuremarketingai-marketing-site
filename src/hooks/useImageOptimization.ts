/**
 * Image Optimization Hook
 * Source: use-image-optimization.ts
 */

import { useState, useEffect } from 'react'

interface ImageOptimizationOptions {
  src: string
  srcSet?: string[]
  lazyLoad?: boolean
  placeholder?: string
}

interface ImageState {
  currentSrc: string
  isLoading: boolean
  error: Error | null
}

export const useImageOptimization = ({
  src,
  srcSet = [],
  lazyLoad = true,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3C/svg%3E",
}: ImageOptimizationOptions): ImageState => {
  const [currentSrc, setCurrentSrc] = useState(lazyLoad ? placeholder : src)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!lazyLoad) {
      setCurrentSrc(src)
      setIsLoading(false)
      return
    }

    // Intersection Observer for lazy loading
    const img = new Image()

    img.onload = () => {
      setCurrentSrc(src)
      setIsLoading(false)
    }

    img.onerror = () => {
      setError(new Error('Failed to load image'))
      setIsLoading(false)
    }

    // Choose best image from srcSet based on screen size
    if (srcSet.length > 0) {
      const screenWidth = window.innerWidth
      const dpr = window.devicePixelRatio || 1
      const targetWidth = screenWidth * dpr

      // Find closest matching size
      const bestSrc = srcSet.reduce((best, current) => {
        const bestWidth = parseInt(best.split(' ')[1]?.replace('w', '') || '0')
        const currentWidth = parseInt(current.split(' ')[1]?.replace('w', '') || '0')

        return Math.abs(currentWidth - targetWidth) < Math.abs(bestWidth - targetWidth)
          ? current
          : best
      })

      img.src = bestSrc.split(' ')[0] || src
    } else {
      img.src = src
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, srcSet, lazyLoad, placeholder])

  return { currentSrc, isLoading, error }
}

/**
 * Generate srcSet string from array of image sizes
 */
export const generateSrcSet = (basePath: string, sizes: number[]): string => {
  return sizes.map((size) => `${basePath}?w=${size} ${size}w`).join(', ')
}

/**
 * Get optimal image format based on browser support
 */
export const getOptimalImageFormat = (): 'webp' | 'avif' | 'jpg' => {
  if (typeof window === 'undefined') {
    return 'jpg'
  }

  // Check AVIF support
  const avifCanvas = document.createElement('canvas')
  if (avifCanvas.toDataURL('image/avif').startsWith('data:image/avif')) {
    return 'avif'
  }

  // Check WebP support
  const webpCanvas = document.createElement('canvas')
  if (webpCanvas.toDataURL('image/webp').startsWith('data:image/webp')) {
    return 'webp'
  }

  return 'jpg'
}
