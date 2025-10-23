/**
 * Container Component
 * 
 * Responsive container with max-width constraints and optional centering.
 * Provides consistent padding and automatically adapts to different screen sizes.
 */

import React from 'react';
import { type ContainerProps } from './types';
import { cn, getSpacingClasses, responsive } from './utils';

const maxWidthMap = {
  mobile: 'max-w-[639px]',
  tablet: 'max-w-[1023px]',
  desktop: 'max-w-[1280px]',
  xl: 'max-w-[1536px]',
  '2xl': 'max-w-[1920px]',
  full: 'max-w-full',
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  style,
  as: Component = 'div',
  maxWidth = 'desktop',
  centered = true,
  fullWidthMobile = true,
  ...spacingProps
}) => {
  const maxWidthClass = responsive(maxWidth, (val) => maxWidthMap[val]);
  
  const classes = cn(
    // Base styles
    'w-full',
    
    // Max width
    maxWidthClass,
    
    // Centering
    centered && 'mx-auto',
    
    // Full width on mobile
    fullWidthMobile && 'mobile:max-w-full',
    
    // Default padding if none provided
    !spacingProps.p && !spacingProps.px && 'px-4 tablet:px-6 desktop:px-8',
    
    // Spacing
    getSpacingClasses(spacingProps),
    
    // Custom classes
    className
  );

  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  );
};

Container.displayName = 'Container';

