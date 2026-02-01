'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type MoodLevel as MoodLevelType } from '@/types';
import { MoodIcon, type MoodLevel } from '@/components/brand';

interface MoodSelectorProps {
  value: MoodLevelType | null;
  onChange: (level: MoodLevelType) => void;
  size?: 'sm' | 'md' | 'lg';
}

// Map numeric mood level to MoodLevel type
const moodLevelMap: Record<MoodLevelType, MoodLevel> = {
  1: 'very-negative',
  2: 'negative',
  3: 'neutral',
  4: 'positive',
  5: 'very-positive',
};

const moodLabels: Record<MoodLevelType, string> = {
  1: 'Very Bad',
  2: 'Bad',
  3: 'Neutral',
  4: 'Good',
  5: 'Very Good',
};

const moodLevels: MoodLevelType[] = [1, 2, 3, 4, 5];

export function MoodSelector({ value, onChange, size = 'md' }: MoodSelectorProps) {
  const iconSizes = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {moodLevels.map((level) => {
        const isSelected = value === level;
        const moodLevel = moodLevelMap[level];

        return (
          <motion.button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl',
              'transition-colors duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              isSelected
                ? 'bg-primary-50 dark:bg-primary-900/20'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={moodLabels[level]}
            aria-pressed={isSelected}
          >
            <MoodIcon
              mood={moodLevel}
              size={iconSizes[size]}
              selected={isSelected}
              animated
            />
            <span
              className={cn(
                'text-xs font-medium transition-colors duration-200',
                isSelected
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              )}
            >
              {moodLabels[level]}
            </span>

            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                layoutId="mood-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary-500 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
