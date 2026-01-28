'use client';

import { cn } from '@/lib/utils';
import { MOOD_OPTIONS, type MoodLevel } from '@/types';

interface MoodSelectorProps {
  value: MoodLevel | null;
  onChange: (level: MoodLevel) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function MoodSelector({ value, onChange, size = 'md' }: MoodSelectorProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {MOOD_OPTIONS.map((option) => (
        <button
          key={option.level}
          type="button"
          onClick={() => onChange(option.level)}
          className={cn(
            'flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200',
            'hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            value === option.level && 'bg-primary-100 dark:bg-primary-900/30'
          )}
          aria-label={option.label}
          aria-pressed={value === option.level}
        >
          <span
            className={cn(
              sizes[size],
              'transition-transform duration-200',
              value === option.level && 'scale-125'
            )}
          >
            {option.emoji}
          </span>
          <span
            className={cn(
              'text-xs font-medium',
              value === option.level
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-neutral-500 dark:text-neutral-400'
            )}
          >
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
