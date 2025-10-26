import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  glow?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

/**
 * Button - Reusable button component with multiple variants
 *
 * @param variant - Button style: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta'
 * @param size - Button size: 'sm' | 'md' | 'lg' | 'xl' (xl for Hero CTAs)
 * @param disabled - Disable button interaction
 * @param loading - Show loading state
 * @param fullWidth - Make button full width
 * @param glow - Enable glow effect
 * @param ariaLabel - Accessible label for screen readers
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  glow = false,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
}) => {
  const baseClasses =
    'font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-active no-select'

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:shadow-glow',
    secondary:
      'bg-gradient-to-r from-accent-secondary to-accent-tertiary text-white hover:shadow-glow-purple',
    outline:
      'border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white',
    ghost: 'text-accent-primary hover:bg-accent-primary/10',
    cta: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/50 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500',
  }

  const sizeClasses = {
    sm: 'min-h-[36px] min-w-[36px] px-4 py-2 text-sm', // 36px (secondary only)
    md: 'min-h-[44px] min-w-[44px] px-6 py-3 text-base', // 44px (acceptable)
    lg: 'min-h-[56px] min-w-[56px] px-8 py-4 text-lg', // 56px (WCAG AAA for CTAs)
    xl: 'min-h-[56px] min-w-[56px] px-10 py-5 text-xl font-bold', // 56px (WCAG AAA)
  }

  const widthClasses = fullWidth ? 'w-full' : ''
  const glowClasses = glow ? 'shadow-glow' : ''

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClasses}
    ${glowClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
