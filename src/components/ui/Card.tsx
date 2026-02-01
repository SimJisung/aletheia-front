'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cardHoverVariants } from '@/lib/motion';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  variant?: 'default' | 'elevated' | 'glass' | 'glass-subtle' | 'glass-strong' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl transition-all duration-200';

    const variants = {
      default: cn(
        'bg-[var(--color-bg-elevated)]',
        'border border-[var(--color-border)]'
      ),
      elevated: cn(
        'bg-[var(--color-bg-elevated)]',
        'shadow-elevation-lg'
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
      'glass-strong': cn(
        'bg-[var(--color-glass-strong)]',
        'backdrop-blur-[24px]',
        'border border-[var(--color-glass-border)]',
        'shadow-[var(--shadow-glass-lg)]'
      ),
      interactive: cn(
        'bg-[var(--color-bg-elevated)]',
        'border border-[var(--color-border)]',
        'shadow-elevation-md',
        'hover:shadow-elevation-xl hover:-translate-y-0.5',
        'hover:border-[var(--color-border-focus)]',
        'cursor-pointer'
      ),
    };

    const paddings = {
      none: '',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
    };

    if (hover || variant === 'interactive') {
      return (
        <motion.div
          ref={ref}
          className={cn(baseStyles, variants[variant], paddings[padding], className)}
          initial="rest"
          whileHover="hover"
          variants={cardHoverVariants}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4 space-y-1.5', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-lg font-semibold tracking-tight',
        'text-neutral-900 dark:text-neutral-100',
        className
      )}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm text-neutral-500 dark:text-neutral-400',
        className
      )}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-6 pt-4 flex items-center gap-3',
        'border-t border-neutral-100 dark:border-neutral-800',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
