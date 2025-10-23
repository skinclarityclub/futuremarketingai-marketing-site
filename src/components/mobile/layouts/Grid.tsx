/**
 * Grid Component
 * 
 * Responsive CSS Grid layout with support for custom columns, rows, and gaps.
 * Automatically adapts grid structure across breakpoints.
 */

import React from 'react';
import { type GridProps } from './types';
import { cn, getSpacingClasses, columns as columnsUtil, rows as rowsUtil, responsive } from './utils';

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  style,
  as: Component = 'div',
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  rows,
  autoFit,
  autoFill,
  ...spacingProps
}) => {
  const columnsClass = autoFit
    ? responsive(autoFit, (val, prefix) => `${prefix}grid-cols-[repeat(auto-fit,minmax(${val},1fr))]`)
    : autoFill
    ? responsive(autoFill, (val, prefix) => `${prefix}grid-cols-[repeat(auto-fill,minmax(${val},1fr))]`)
    : columnsUtil(columns);
  
  const rowsClass = rowsUtil(rows);
  
  const classes = cn(
    // Base grid
    'grid',
    
    // Columns & rows
    columnsClass,
    rowsClass,
    
    // Default gap if not provided
    !spacingProps.gap && 'gap-4',
    
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

Grid.displayName = 'Grid';

