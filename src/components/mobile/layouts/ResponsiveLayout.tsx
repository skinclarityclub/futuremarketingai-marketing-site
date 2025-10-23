/**
 * ResponsiveLayout Component
 * 
 * High-level responsive layout component that combines Container, Grid, and Flex.
 * Provides common layout patterns out of the box.
 */

import React from 'react';
import { Container } from './Container';
import { Grid } from './Grid';
import { Flex } from './Flex';
import { type LayoutProps } from './types';

interface ResponsiveLayoutProps extends LayoutProps {
  /** Layout variant */
  variant?: 'single' | 'sidebar' | 'split' | 'cards';
  /** Sidebar content (for sidebar variant) */
  sidebar?: React.ReactNode;
  /** Sidebar position */
  sidebarPosition?: 'left' | 'right';
  /** Number of card columns (for cards variant) */
  cardColumns?: { mobile?: number; tablet?: number; desktop?: number };
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  variant = 'single',
  sidebar,
  sidebarPosition = 'left',
  cardColumns = { mobile: 1, tablet: 2, desktop: 3 },
  ...props
}) => {
  // Single column layout (most mobile pages)
  if (variant === 'single') {
    return (
      <Container className={className} {...props}>
        {children}
      </Container>
    );
  }

  // Sidebar layout (mobile: stacked, tablet+: side-by-side)
  if (variant === 'sidebar') {
    return (
      <Container className={className} {...props}>
        <Grid
          columns={{ mobile: 1, desktop: 4 }}
          gap={6}
        >
          {sidebarPosition === 'left' && sidebar && (
            <div className="desktop:col-span-1">{sidebar}</div>
          )}
          <div className="desktop:col-span-3">{children}</div>
          {sidebarPosition === 'right' && sidebar && (
            <div className="desktop:col-span-1">{sidebar}</div>
          )}
        </Grid>
      </Container>
    );
  }

  // Split layout (50/50 on desktop, stacked on mobile)
  if (variant === 'split') {
    const childArray = React.Children.toArray(children);
    return (
      <Container className={className} {...props}>
        <Grid
          columns={{ mobile: 1, desktop: 2 }}
          gap={6}
        >
          {childArray.map((child, index) => (
            <div key={index}>{child}</div>
          ))}
        </Grid>
      </Container>
    );
  }

  // Cards grid layout
  if (variant === 'cards') {
    return (
      <Container className={className} {...props}>
        <Grid columns={cardColumns} gap={4}>
          {children}
        </Grid>
      </Container>
    );
  }

  return <Container className={className} {...props}>{children}</Container>;
};

ResponsiveLayout.displayName = 'ResponsiveLayout';

