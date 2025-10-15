import React from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'strong' | 'subtle'
  hover?: boolean
  glow?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  id?: string
}

/**
 * GlassCard - Reusable glassmorphism card component
 *
 * @param children - Content to display inside the card
 * @param className - Additional Tailwind classes
 * @param variant - Glass effect intensity: 'default' | 'strong' | 'subtle'
 * @param hover - Enable hover lift effect
 * @param glow - Enable glow effect
 * @param onClick - Click handler (makes card interactive)
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      hover = false,
      glow = false,
      onClick,
      onMouseEnter,
      onMouseLeave,
      id,
      ...rest
    },
    ref
  ) => {
    // Modern styling - NO grey backgrounds!
    const variantStyles = {
      default: {
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
      strong: {
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      },
      subtle: {
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      },
    }

    const baseClasses = 'rounded-2xl transition-all duration-300'
    const interactiveClasses = onClick ? 'cursor-pointer' : ''
    const hoverClasses = hover ? 'hover-lift' : ''
    const glowClasses = glow ? 'shadow-glow hover:shadow-glow-lg' : ''

    const combinedClasses = `
    ${baseClasses}
    ${interactiveClasses}
    ${hoverClasses}
    ${glowClasses}
    ${className}
  `
      .trim()
      .replace(/\s+/g, ' ')

    return (
      <div
        ref={ref}
        id={id}
        className={combinedClasses}
        style={variantStyles[variant]}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
        {...rest}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export default GlassCard
