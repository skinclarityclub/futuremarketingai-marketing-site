/**
 * MobileCard Component
 * 
 * Responsive card component with touch-friendly padding and sizing.
 * Automatically adjusts layout across breakpoints.
 */

import React from 'react';
import { type LayoutProps } from './types';
import { cn, getSpacingClasses } from './utils';

interface MobileCardProps extends LayoutProps {
  /** Card variant */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** Enable hover effects */
  hoverable?: boolean;
  /** Make card interactive/clickable */
  interactive?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  style,
  as: Component = 'div',
  variant = 'elevated',
  hoverable = false,
  interactive = false,
  onClick,
  ...spacingProps
}) => {
  const isClickable = interactive || !!onClick;
  
  const classes = cn(
    // Base styles
    'rounded-lg',
    'transition-all duration-200',
    
    // Variant styles
    variant === 'elevated' && 'bg-bg-card shadow-lg',
    variant === 'outlined' && 'bg-transparent border-2 border-border-primary',
    variant === 'filled' && 'bg-bg-surface',
    
    // Dark mode
    'dark:bg-bg-surface',
    
    // Default padding if not provided
    !spacingProps.p && 'p-4 tablet:p-6',
    
    // Interactive states
    isClickable && 'cursor-pointer',
    hoverable && 'hover:scale-[1.02] hover:shadow-xl',
    isClickable && 'active:scale-[0.98]',
    
    // Touch-friendly minimum size
    'min-h-[80px]',
    
    // Spacing
    getSpacingClasses(spacingProps),
    
    // Custom classes
    className
  );

  return (
    <Component
      className={classes}
      style={style}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {children}
    </Component>
  );
};

MobileCard.displayName = 'MobileCard';

