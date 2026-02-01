import { Variants, Transition } from 'framer-motion';

// ============================================
// TRANSITIONS
// ============================================

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
};

export const smoothTransition: Transition = {
  type: 'tween',
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};

export const fastTransition: Transition = {
  type: 'tween',
  duration: 0.15,
  ease: 'easeOut',
};

export const slowTransition: Transition = {
  type: 'tween',
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
};

// ============================================
// PAGE VARIANTS
// ============================================

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================
// FADE VARIANTS
// ============================================

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: smoothTransition,
  },
  exit: {
    opacity: 0,
    transition: fastTransition,
  },
};

export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: fastTransition,
  },
};

export const fadeInDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: fastTransition,
  },
};

// ============================================
// SCALE VARIANTS
// ============================================

export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: fastTransition,
  },
};

export const popInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: fastTransition,
  },
};

// ============================================
// SLIDE VARIANTS
// ============================================

export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: fastTransition,
  },
};

export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: fastTransition,
  },
};

// ============================================
// STAGGER VARIANTS
// ============================================

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const staggerFastContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

// ============================================
// MODAL VARIANTS
// ============================================

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, delay: 0.1 },
  },
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: fastTransition,
  },
};

export const drawerVariants: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================
// INTERACTIVE VARIANTS
// ============================================

export const buttonTapVariants = {
  tap: { scale: 0.98 },
};

export const cardHoverVariants = {
  rest: {
    y: 0,
    boxShadow: '0 4px 6px -2px rgb(0 0 0 / 0.03), 0 10px 15px -3px rgb(0 0 0 / 0.08)',
  },
  hover: {
    y: -2,
    boxShadow: '0 8px 10px -3px rgb(0 0 0 / 0.04), 0 20px 25px -5px rgb(0 0 0 / 0.08)',
    transition: smoothTransition,
  },
};

// ============================================
// TAB INDICATOR
// ============================================

export const tabIndicatorVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
};

// ============================================
// LIST ITEM VARIANTS
// ============================================

export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      ...smoothTransition,
    },
  }),
  exit: {
    opacity: 0,
    x: 10,
    transition: fastTransition,
  },
};

// ============================================
// TOOLTIP VARIANTS
// ============================================

export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

// ============================================
// COLLAPSE VARIANTS
// ============================================

export const collapseVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.1 },
    },
  },
};
