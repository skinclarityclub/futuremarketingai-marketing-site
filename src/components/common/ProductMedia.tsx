import React from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * ProductMedia — Video/screenshot component with reduced motion support.
 *
 * Shows an autoplay muted video loop for full-motion users.
 * Falls back to a static poster image when the user prefers
 * reduced motion, ensuring accessibility compliance.
 */

interface ProductMediaProps {
  videoSrc: string
  posterSrc: string
  alt: string
  className?: string
}

export const ProductMedia: React.FC<ProductMediaProps> = ({
  videoSrc,
  posterSrc,
  alt,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <img
        src={posterSrc}
        alt={alt}
        className={`rounded-card w-full ${className ?? ''}`}
        loading="lazy"
      />
    )
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster={posterSrc}
      className={`rounded-card w-full ${className ?? ''}`}
      preload="none"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  )
}

export default ProductMedia
