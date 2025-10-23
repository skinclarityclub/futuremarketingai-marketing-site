/**
 * Flex Component
 * 
 * Flexible flexbox layout with responsive direction, justify, and align props.
 * Ideal for one-dimensional layouts (rows or columns).
 */

import React from 'react';
import { type FlexProps } from './types';
import {
  cn,
  getSpacingClasses,
  flexDirection as flexDirectionUtil,
  justifyContent as justifyContentUtil,
  alignItems as alignItemsUtil,
  flexWrap as flexWrapUtil,
} from './utils';

export const Flex: React.FC<FlexProps> = ({
  children,
  className,
  style,
  as: Component = 'div',
  direction = 'row',
  justify,
  align,
  wrap,
  ...spacingProps
}) => {
  const classes = cn(
    // Base flex
    'flex',
    
    // Direction
    flexDirectionUtil(direction),
    
    // Justify & align
    justifyContentUtil(justify),
    alignItemsUtil(align),
    
    // Wrap
    flexWrapUtil(wrap),
    
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

Flex.displayName = 'Flex';

