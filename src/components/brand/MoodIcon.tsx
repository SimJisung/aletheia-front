'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export type MoodLevel = 'very-positive' | 'positive' | 'neutral' | 'negative' | 'very-negative';

interface MoodIconProps {
  mood: MoodLevel;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  animated?: boolean;
  className?: string;
}

const sizes = {
  sm: 20,
  md: 28,
  lg: 36,
};

const moodColors = {
  'very-positive': {
    primary: '#10b981',    // success-500
    secondary: '#34d399',  // success-400
    bg: '#ecfdf5',         // success-50
  },
  'positive': {
    primary: '#3b82f6',    // blue-500
    secondary: '#60a5fa',  // blue-400
    bg: '#eff6ff',         // blue-50
  },
  'neutral': {
    primary: '#64748b',    // neutral-500
    secondary: '#94a3b8',  // neutral-400
    bg: '#f8fafc',         // neutral-50
  },
  'negative': {
    primary: '#f59e0b',    // warning-500
    secondary: '#fbbf24',  // warning-400
    bg: '#fffbeb',         // warning-50
  },
  'very-negative': {
    primary: '#ef4444',    // error-500
    secondary: '#f87171',  // error-400
    bg: '#fef2f2',         // error-50
  },
};

const moodLabels: Record<MoodLevel, string> = {
  'very-positive': 'Very Positive',
  'positive': 'Positive',
  'neutral': 'Neutral',
  'negative': 'Negative',
  'very-negative': 'Very Negative',
};

// SVG paths for each mood - abstract curves representing emotional states
const moodPaths: Record<MoodLevel, { main: string; accent: string }> = {
  'very-positive': {
    main: 'M4 18 Q12 6 20 6 Q28 6 36 18',
    accent: 'M8 14 Q16 8 24 8 Q32 8 36 14',
  },
  'positive': {
    main: 'M4 16 Q12 10 20 10 Q28 10 36 16',
    accent: 'M10 14 Q18 10 26 10 Q32 10 34 14',
  },
  'neutral': {
    main: 'M4 20 L36 20',
    accent: 'M10 16 L30 16',
  },
  'negative': {
    main: 'M4 14 Q12 20 20 20 Q28 20 36 14',
    accent: 'M10 12 Q18 18 26 18 Q32 18 34 12',
  },
  'very-negative': {
    main: 'M4 10 Q12 22 20 22 Q28 22 36 10',
    accent: 'M8 8 Q16 18 24 18 Q32 18 36 8',
  },
};

export function MoodIcon({
  mood,
  size = 'md',
  selected = false,
  animated = false,
  className,
}: MoodIconProps) {
  const iconSize = sizes[size];
  const colors = moodColors[mood];
  const paths = moodPaths[mood];

  const containerVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    selected: { scale: 1.15 },
  };

  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.5, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
      },
    },
  };

  return (
    <motion.div
      className={clsx(
        'relative inline-flex items-center justify-center rounded-full',
        'transition-colors duration-200',
        selected && 'ring-2 ring-offset-2',
        className
      )}
      style={{
        width: iconSize + 12,
        height: iconSize + 12,
        backgroundColor: selected ? colors.bg : 'transparent',
      }}
      variants={containerVariants}
      initial="initial"
      whileHover={animated ? 'hover' : undefined}
      whileTap={animated ? 'tap' : undefined}
      animate={selected ? 'selected' : 'initial'}
      aria-label={moodLabels[mood]}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill={colors.bg}
          className="dark:opacity-20"
        />

        {/* Main mood curve */}
        <motion.path
          d={paths.main}
          stroke={colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          variants={animated ? pathVariants : undefined}
          initial={animated ? 'initial' : undefined}
          animate={animated ? 'animate' : undefined}
        />

        {/* Accent curve */}
        <motion.path
          d={paths.accent}
          stroke={colors.secondary}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
          variants={animated ? pathVariants : undefined}
          initial={animated ? 'initial' : undefined}
          animate={animated ? 'animate' : undefined}
        />

        {/* Center dot */}
        <circle
          cx="20"
          cy="20"
          r="3"
          fill={colors.primary}
        />
      </svg>
    </motion.div>
  );
}

// Mood selector component for forms
interface MoodSelectorProps {
  value?: MoodLevel;
  onChange?: (mood: MoodLevel) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const moods: MoodLevel[] = [
  'very-positive',
  'positive',
  'neutral',
  'negative',
  'very-negative',
];

export function MoodSelector({
  value,
  onChange,
  size = 'md',
  className,
}: MoodSelectorProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-2',
        className
      )}
      role="radiogroup"
      aria-label="Select your mood"
    >
      {moods.map((mood) => (
        <button
          key={mood}
          type="button"
          onClick={() => onChange?.(mood)}
          className={clsx(
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'rounded-full transition-transform duration-200',
            value === mood && 'scale-110'
          )}
          role="radio"
          aria-checked={value === mood}
          aria-label={moodLabels[mood]}
        >
          <MoodIcon
            mood={mood}
            size={size}
            selected={value === mood}
            animated
          />
        </button>
      ))}
    </div>
  );
}

export default MoodIcon;
