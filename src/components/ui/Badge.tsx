'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  glow?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, glow = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full transition-all duration-200';

    const variants = {
      default: cn(
        'bg-neutral-100 text-neutral-700',
        'dark:bg-neutral-800 dark:text-neutral-300'
      ),
      primary: cn(
        'bg-primary-100 text-primary-700',
        'dark:bg-primary-900/30 dark:text-primary-300',
        glow && 'shadow-glow-primary'
      ),
      secondary: cn(
        'bg-secondary-100 text-secondary-700',
        'dark:bg-secondary-900/30 dark:text-secondary-300'
      ),
      success: cn(
        'bg-success-100 text-success-700',
        'dark:bg-success-900/30 dark:text-success-300',
        glow && 'shadow-glow-success'
      ),
      warning: cn(
        'bg-warning-100 text-warning-700',
        'dark:bg-warning-900/30 dark:text-warning-300',
        glow && 'shadow-glow-accent'
      ),
      danger: cn(
        'bg-error-100 text-error-700',
        'dark:bg-error-900/30 dark:text-error-300'
      ),
      outline: cn(
        'border border-neutral-300 text-neutral-600',
        'dark:border-neutral-600 dark:text-neutral-400',
        'bg-transparent'
      ),
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
    };

    const dotColors = {
      default: 'bg-neutral-500',
      primary: 'bg-primary-500',
      secondary: 'bg-secondary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      danger: 'bg-error-500',
      outline: 'bg-neutral-400',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              dotColors[variant],
              glow && variant !== 'outline' && 'animate-pulse'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
