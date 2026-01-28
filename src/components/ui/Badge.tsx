'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    const variants = {
      default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
      primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
      secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300',
      success: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      outline: 'border border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
