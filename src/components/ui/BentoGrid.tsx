'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 2 | 3 | 4;
}

const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, cols = 4, children, ...props }, ref) => {
    const colClasses = {
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid gap-4',
          'grid-cols-1',
          colClasses[cols],
          'auto-rows-[minmax(160px,auto)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BentoGrid.displayName = 'BentoGrid';

export interface BentoCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  span?: 'default' | 'wide' | 'tall' | 'large';
  variant?: 'default' | 'glass' | 'glass-subtle' | 'gradient';
  hover?: boolean;
}

const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(
  ({ className, span = 'default', variant = 'glass', hover = true, children, ...props }, ref) => {
    const spanClasses = {
      default: '',
      wide: 'sm:col-span-2',
      tall: 'sm:row-span-2',
      large: 'sm:col-span-2 sm:row-span-2',
    };

    const variantClasses = {
      default: cn(
        'bg-[var(--color-bg-elevated)]',
        'border border-[var(--color-border)]'
      ),
      glass: cn(
        'bg-[var(--color-glass-medium)]',
        'backdrop-blur-[16px]',
        'border border-[var(--color-glass-border)]',
        'shadow-[var(--shadow-glass-md)]'
      ),
      'glass-subtle': cn(
        'bg-[var(--color-glass-subtle)]',
        'backdrop-blur-[8px]',
        'border border-[var(--color-glass-border)]',
        'shadow-[var(--shadow-glass-sm)]'
      ),
      gradient: cn(
        'bg-gradient-to-br from-primary-500/10 to-secondary-500/10',
        'border border-[var(--color-glass-border)]',
        'backdrop-blur-[8px]'
      ),
    };

    const baseStyles = cn(
      'rounded-2xl overflow-hidden',
      'transition-all duration-300',
      variantClasses[variant],
      spanClasses[span]
    );

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={cn(baseStyles, className)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -2,
            boxShadow: 'var(--shadow-glass-lg)',
            transition: { duration: 0.2 },
          }}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BentoCard.displayName = 'BentoCard';

// Content wrapper for consistent padding
export interface BentoCardContentProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const BentoCardContent = forwardRef<HTMLDivElement, BentoCardContentProps>(
  ({ className, padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-5',
      lg: 'p-5 sm:p-6',
    };

    return (
      <div
        ref={ref}
        className={cn('h-full', paddingClasses[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BentoCardContent.displayName = 'BentoCardContent';

export { BentoGrid, BentoCard, BentoCardContent };
