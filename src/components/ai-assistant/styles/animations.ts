/**
 * Framer Motion Animation Variants
 *
 * Reusable animation configurations for the AI Journey Assistant
 */

import type { Variants } from 'framer-motion'

/**
 * Breathing Animation for Floating Action Button
 * Very subtle pulse effect - premium B2B SaaS style (2025)
 */
export const breathingAnimation: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1], // Only 2% growth - very subtle
    transition: {
      duration: 3, // Slower for elegance
      repeat: Infinity,
      ease: [0.16, 1, 0.3, 1], // Premium easing curve
    },
  },
}

/**
 * FAB Hover Animation - Premium B2B style
 */
export const fabHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05, // Subtle 5% growth on hover
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  tap: {
    scale: 0.97, // Minimal press feedback
    transition: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

/**
 * Chat Panel Slide In (Desktop)
 */
export const panelSlideIn: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Bottom Sheet Slide Up (Mobile)
 */
export const bottomSheetSlideUp: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.25,
    },
  },
}

/**
 * Message Fade In
 */
export const messageFadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

/**
 * Typing Indicator Animation
 */
export const typingDot: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Badge Bounce (Achievement)
 */
export const badgeBounce: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
}

/**
 * Unread Badge Pulse
 */
export const unreadPulse: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Reduced Motion Variants (Accessibility)
 * Used when user has prefers-reduced-motion enabled
 */
export const reducedMotionVariants = {
  breathingAnimation: {
    initial: { scale: 1 },
    animate: { scale: 1 }, // No animation
  },
  panelSlideIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: { opacity: 0 },
  },
  messageFadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.15 },
    },
  },
}
