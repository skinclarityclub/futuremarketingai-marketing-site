/**
 * Type definitions for mobile layout components
 */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'xl' | '2xl';

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export interface SpacingProps {
  /** Padding (all sides) */
  p?: ResponsiveValue<number>;
  /** Padding horizontal (left & right) */
  px?: ResponsiveValue<number>;
  /** Padding vertical (top & bottom) */
  py?: ResponsiveValue<number>;
  /** Padding top */
  pt?: ResponsiveValue<number>;
  /** Padding right */
  pr?: ResponsiveValue<number>;
  /** Padding bottom */
  pb?: ResponsiveValue<number>;
  /** Padding left */
  pl?: ResponsiveValue<number>;
  
  /** Margin (all sides) */
  m?: ResponsiveValue<number>;
  /** Margin horizontal (left & right) */
  mx?: ResponsiveValue<number>;
  /** Margin vertical (top & bottom) */
  my?: ResponsiveValue<number>;
  /** Margin top */
  mt?: ResponsiveValue<number>;
  /** Margin right */
  mr?: ResponsiveValue<number>;
  /** Margin bottom */
  mb?: ResponsiveValue<number>;
  /** Margin left */
  ml?: ResponsiveValue<number>;
  
  /** Gap between children (for flex/grid) */
  gap?: ResponsiveValue<number>;
}

export interface LayoutProps extends SpacingProps {
  /** CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Content */
  children?: React.ReactNode;
  /** HTML element to render as */
  as?: keyof JSX.IntrinsicElements;
}

export interface GridProps extends LayoutProps {
  /** Number of columns */
  columns?: ResponsiveValue<number>;
  /** Number of rows */
  rows?: ResponsiveValue<number>;
  /** Auto-fit columns with min width */
  autoFit?: ResponsiveValue<string>;
  /** Auto-fill columns with min width */
  autoFill?: ResponsiveValue<string>;
}

export interface FlexProps extends LayoutProps {
  /** Flex direction */
  direction?: ResponsiveValue<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
  /** Justify content */
  justify?: ResponsiveValue<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'>;
  /** Align items */
  align?: ResponsiveValue<'start' | 'end' | 'center' | 'baseline' | 'stretch'>;
  /** Flex wrap */
  wrap?: ResponsiveValue<boolean | 'reverse'>;
}

export interface StackProps extends LayoutProps {
  /** Stack direction (vertical or horizontal) */
  direction?: ResponsiveValue<'vertical' | 'horizontal'>;
  /** Spacing between items */
  spacing?: ResponsiveValue<number>;
  /** Divider between items */
  divider?: React.ReactNode;
}

export interface ContainerProps extends LayoutProps {
  /** Maximum width */
  maxWidth?: ResponsiveValue<'mobile' | 'tablet' | 'desktop' | 'xl' | '2xl' | 'full'>;
  /** Center the container */
  centered?: boolean;
  /** Full width on mobile */
  fullWidthMobile?: boolean;
}

