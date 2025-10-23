/**
 * Stack Component
 * 
 * Vertical or horizontal stack with consistent spacing between items.
 * Optionally renders dividers between children.
 */

import React from 'react';
import { type StackProps } from './types';
import { cn, getSpacingClasses, gap } from './utils';

export const Stack: React.FC<StackProps> = ({
  children,
  className,
  style,
  as: Component = 'div',
  direction = 'vertical',
  spacing: spacingProp,
  divider,
  ...spacingProps
}) => {
  const isVertical = typeof direction === 'string' 
    ? direction === 'vertical' 
    : direction.mobile === 'vertical';
  
  const classes = cn(
    // Base flex
    'flex',
    
    // Direction based on orientation
    typeof direction === 'string'
      ? direction === 'vertical' ? 'flex-col' : 'flex-row'
      : direction.mobile === 'vertical' 
        ? 'flex-col' 
        : 'flex-row',
    
    // Gap/spacing
    spacingProp ? gap(spacingProp) : 'gap-4',
    
    // Other spacing props
    getSpacingClasses(spacingProps),
    
    // Custom classes
    className
  );

  // Render children with optional dividers
  const childArray = React.Children.toArray(children);
  const content = divider
    ? childArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < childArray.length - 1 && (
            <div 
              className={cn(
                'flex-shrink-0',
                isVertical ? 'w-full h-px' : 'w-px h-full'
              )}
            >
              {divider}
            </div>
          )}
        </React.Fragment>
      ))
    : children;

  return (
    <Component className={classes} style={style}>
      {content}
    </Component>
  );
};

Stack.displayName = 'Stack';

