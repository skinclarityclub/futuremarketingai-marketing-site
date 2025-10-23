import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * AccordionItem - Reusable accordion/expandable card component
 *
 * Features:
 * - Headless UI Disclosure for accessibility
 * - Smooth expand/collapse animations (Framer Motion)
 * - Large touch targets (≥48px)
 * - ARIA attributes (aria-expanded)
 * - Keyboard navigation support
 * - Customizable styling
 *
 * Usage:
 * ```tsx
 * <AccordionItem title="Feature Title" icon={<Icon />}>
 *   <p>Feature details go here...</p>
 * </AccordionItem>
 * ```
 */

export interface AccordionItemProps {
  /** Title shown in collapsed state */
  title: string
  /** Optional icon displayed next to title */
  icon?: React.ReactNode
  /** Content shown when expanded */
  children: React.ReactNode
  /** Initial expanded state (default: false) */
  defaultOpen?: boolean
  /** Custom className for container */
  className?: string
  /** Custom className for button */
  buttonClassName?: string
  /** Custom className for content panel */
  panelClassName?: string
  /** Disable the accordion */
  disabled?: boolean
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
  className = '',
  buttonClassName = '',
  panelClassName = '',
  disabled = false,
}) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div
          className={`
            border border-white/10
            rounded-2xl
            bg-white/5 backdrop-blur-lg
            overflow-hidden
            transition-all duration-200
            ${open ? 'shadow-xl shadow-accent-primary/10' : 'shadow-lg'}
            ${className}
          `}
        >
          {/* Disclosure Button (Header) */}
          <Disclosure.Button
            className={`
              w-full
              flex items-center justify-between
              px-6 py-4
              text-left
              min-h-touch
              transition-colors duration-200
              ${!disabled && 'hover:bg-white/5'}
              ${disabled && 'cursor-not-allowed opacity-50'}
              ${buttonClassName}
            `}
            disabled={disabled}
          >
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {icon && (
                <div className="flex-shrink-0 text-accent-primary" aria-hidden="true">
                  {icon}
                </div>
              )}
              <span className="text-lg font-semibold text-white truncate">{title}</span>
            </div>

            {/* Right: Chevron Indicator */}
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex-shrink-0 ml-4"
            >
              <ChevronDown
                className={`
                  w-5 h-5
                  transition-colors duration-200
                  ${open ? 'text-accent-primary' : 'text-white/60'}
                `}
                aria-hidden="true"
              />
            </motion.div>
          </Disclosure.Button>

          {/* Disclosure Panel (Content) */}
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel
              className={`
                px-6 py-4
                border-t border-white/10
                text-blue-100/80
                leading-relaxed
                ${panelClassName}
              `}
            >
              {children}
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}

/**
 * Accordion - Container for multiple AccordionItems
 *
 * Features:
 * - Manages spacing between accordion items
 * - Optional single-item-open behavior
 *
 * Usage:
 * ```tsx
 * <Accordion>
 *   <AccordionItem title="Item 1">Content 1</AccordionItem>
 *   <AccordionItem title="Item 2">Content 2</AccordionItem>
 * </Accordion>
 * ```
 */

interface AccordionProps {
  children: React.ReactNode
  /** Spacing between items */
  spacing?: 'tight' | 'normal' | 'loose'
  /** Custom className */
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  spacing = 'normal',
  className = '',
}) => {
  const spacingClasses = {
    tight: 'space-y-2',
    normal: 'space-y-4',
    loose: 'space-y-6',
  }

  return <div className={`${spacingClasses[spacing]} ${className}`}>{children}</div>
}

export default AccordionItem
