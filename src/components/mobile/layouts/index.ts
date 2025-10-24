/**
 * Mobile Layout Components
 *
 * Collection of mobile-specific layout components.
 * These are NEW components, separate from desktop layouts.
 *
 * @desktop-first Use ONLY in mobile-specific code!
 *
 * Usage:
 * ```tsx
 * import { MobileContainer, MobileGrid, MobileStack, MobileCard } from '@/components/mobile/layouts';
 *
 * function MyMobileComponent() {
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *
 *   if (!isMobile) return null; // Desktop uses different components
 *
 *   return (
 *     <MobileContainer>
 *       <MobileStack gap="lg">
 *         <MobileCard>Content</MobileCard>
 *       </MobileStack>
 *     </MobileContainer>
 *   );
 * }
 * ```
 */

export { MobileContainer } from './MobileContainer'
export { MobileGrid } from './MobileGrid'
export { MobileStack } from './MobileStack'
export { MobileCard } from './MobileCard'
