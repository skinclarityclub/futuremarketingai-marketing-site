/**
 * Utility functions for responsive layout components
 */

import { type ResponsiveValue, type Breakpoint } from './types';

const breakpoints: Record<Breakpoint, string> = {
  mobile: '',
  tablet: 'tablet:',
  desktop: 'desktop:',
  xl: 'xl:',
  '2xl': '2xl:',
};

/**
 * Convert responsive value to Tailwind CSS classes
 */
export function responsive<T>(
  value: ResponsiveValue<T> | undefined,
  converter: (val: T, prefix: string) => string
): string {
  if (!value) return '';

  // Handle simple non-responsive values
  if (typeof value !== 'object' || value === null) {
    return converter(value as T, '');
  }

  // Handle responsive object
  return Object.entries(value)
    .map(([breakpoint, val]) => {
      const prefix = breakpoints[breakpoint as Breakpoint] || '';
      return converter(val as T, prefix);
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Convert spacing value to Tailwind spacing class
 */
export function spacing(
  property: string,
  value: ResponsiveValue<number> | undefined
): string {
  return responsive(value, (val, prefix) => `${prefix}${property}-${val}`);
}

/**
 * Convert gap value to Tailwind gap class
 */
export function gap(value: ResponsiveValue<number> | undefined): string {
  return responsive(value, (val, prefix) => `${prefix}gap-${val}`);
}

/**
 * Convert columns to Tailwind grid-cols class
 */
export function columns(value: ResponsiveValue<number> | undefined): string {
  return responsive(value, (val, prefix) => `${prefix}grid-cols-${val}`);
}

/**
 * Convert rows to Tailwind grid-rows class
 */
export function rows(value: ResponsiveValue<number> | undefined): string {
  return responsive(value, (val, prefix) => `${prefix}grid-rows-${val}`);
}

/**
 * Convert flex direction to Tailwind class
 */
export function flexDirection(
  value: ResponsiveValue<'row' | 'column' | 'row-reverse' | 'column-reverse'> | undefined
): string {
  return responsive(value, (val, prefix) => {
    const dirMap = {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    };
    return `${prefix}${dirMap[val]}`;
  });
}

/**
 * Convert justify content to Tailwind class
 */
export function justifyContent(
  value: ResponsiveValue<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'> | undefined
): string {
  return responsive(value, (val, prefix) => {
    const justifyMap = {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };
    return `${prefix}${justifyMap[val]}`;
  });
}

/**
 * Convert align items to Tailwind class
 */
export function alignItems(
  value: ResponsiveValue<'start' | 'end' | 'center' | 'baseline' | 'stretch'> | undefined
): string {
  return responsive(value, (val, prefix) => {
    const alignMap = {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    };
    return `${prefix}${alignMap[val]}`;
  });
}

/**
 * Convert flex wrap to Tailwind class
 */
export function flexWrap(value: ResponsiveValue<boolean | 'reverse'> | undefined): string {
  return responsive(value, (val, prefix) => {
    if (val === true) return `${prefix}flex-wrap`;
    if (val === 'reverse') return `${prefix}flex-wrap-reverse`;
    if (val === false) return `${prefix}flex-nowrap`;
    return '';
  });
}

/**
 * Combine multiple class strings, filtering out empty values
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate spacing props classes
 */
export function getSpacingClasses(props: {
  p?: ResponsiveValue<number>;
  px?: ResponsiveValue<number>;
  py?: ResponsiveValue<number>;
  pt?: ResponsiveValue<number>;
  pr?: ResponsiveValue<number>;
  pb?: ResponsiveValue<number>;
  pl?: ResponsiveValue<number>;
  m?: ResponsiveValue<number>;
  mx?: ResponsiveValue<number>;
  my?: ResponsiveValue<number>;
  mt?: ResponsiveValue<number>;
  mr?: ResponsiveValue<number>;
  mb?: ResponsiveValue<number>;
  ml?: ResponsiveValue<number>;
  gap?: ResponsiveValue<number>;
}): string {
  return cn(
    spacing('p', props.p),
    spacing('px', props.px),
    spacing('py', props.py),
    spacing('pt', props.pt),
    spacing('pr', props.pr),
    spacing('pb', props.pb),
    spacing('pl', props.pl),
    spacing('m', props.m),
    spacing('mx', props.mx),
    spacing('my', props.my),
    spacing('mt', props.mt),
    spacing('mr', props.mr),
    spacing('mb', props.mb),
    spacing('ml', props.ml),
    gap(props.gap)
  );
}

