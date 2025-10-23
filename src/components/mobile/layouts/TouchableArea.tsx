/**
 * TouchableArea Component
 * 
 * Ensures minimum touch target size (48x48px) for interactive elements.
 * Wraps content and adds appropriate padding to meet WCAG guidelines.
 */

import React from 'react';
import { type LayoutProps } from './types';
import { cn, getSpacingClasses } from './utils';

interface TouchableAreaProps extends LayoutProps {
  /** Touch target size */
  size?: 'sm' | 'md' | 'lg';
  /** Enable press effect */
  pressEffect?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** ARIA label */
  'aria-label'?: string;
}

const sizeMap = {
  sm: 'min-w-touch-sm min-h-touch-sm', // 44x44px (iOS minimum)
  md: 'min-w-touch-md min-h-touch-md', // 48x48px (WCAG AAA)
  lg: 'min-w-touch-lg min-h-touch-lg', // 56x56px (comfortable)
};

export const TouchableArea: React.FC<TouchableAreaProps> = ({
  children,
  className,
  style,
  as: Component = 'button',
  size = 'md',
  pressEffect = true,
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  ...spacingProps
}) => {
  const classes = cn(
    // Base styles
    'inline-flex items-center justify-center',
    'rounded-lg',
    'transition-all duration-150',
    
    // Touch target size
    sizeMap[size],
    
    // Default padding if not provided
    !spacingProps.p && 'p-2',
    
    // Interactive states
    !disabled && 'cursor-pointer',
    !disabled && pressEffect && 'active:scale-95',
    !disabled && 'hover:bg-bg-hover',
    
    // Disabled state
    disabled && 'opacity-50 cursor-not-allowed',
    
    // Focus visible for keyboard navigation
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
    
    // Spacing
    getSpacingClasses(spacingProps),
    
    // Custom classes
    className
  );

  return (
    <Component
      className={classes}
      style={style}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type={Component === 'button' ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};

TouchableArea.displayName = 'TouchableArea';

