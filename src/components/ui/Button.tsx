'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    leftIcon,
    rightIcon,
    children,
    ...props
  }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
      'transition-all duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
    );

    const variants = {
      primary: cn(
        'bg-gradient-to-br from-primary-500 to-primary-600 text-white',
        'shadow-elevation-md hover:shadow-elevation-lg',
        'hover:brightness-110',
        'focus-visible:ring-primary-500',
        'active:scale-[0.98]'
      ),
      secondary: cn(
        'bg-secondary-100 text-secondary-700',
        'dark:bg-secondary-900/30 dark:text-secondary-300',
        'hover:bg-secondary-200 dark:hover:bg-secondary-900/50',
        'focus-visible:ring-secondary-500',
        'active:scale-[0.98]'
      ),
      outline: cn(
        'border-2 border-primary-300 text-primary-600',
        'dark:border-primary-700 dark:text-primary-400',
        'hover:bg-primary-50 dark:hover:bg-primary-900/20',
        'focus-visible:ring-primary-500',
        'active:scale-[0.98]'
      ),
      ghost: cn(
        'text-[var(--color-text-secondary)]',
        'hover:bg-[var(--color-hover)]',
        'focus-visible:ring-neutral-500',
        'active:scale-[0.98]'
      ),
      danger: cn(
        'bg-gradient-to-br from-error-500 to-error-600 text-white',
        'shadow-elevation-md hover:shadow-elevation-lg',
        'hover:brightness-110',
        'focus-visible:ring-error-500',
        'active:scale-[0.98]'
      ),
      glass: cn(
        'bg-[var(--color-glass-subtle)]',
        'backdrop-blur-[12px]',
        'border border-[var(--color-glass-border)]',
        'text-[var(--color-text-primary)]',
        'shadow-[var(--shadow-glass-sm)]',
        'hover:bg-[var(--color-glass-medium)]',
        'hover:shadow-[var(--shadow-glass-md)]',
        'focus-visible:ring-primary-500',
        'active:scale-[0.98]'
      ),
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };

    const iconSizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isDisabled}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {isLoading ? (
          <Loader2 className={cn('animate-spin', iconSizes[size])} />
        ) : leftIcon ? (
          <span className={iconSizes[size]}>{leftIcon}</span>
        ) : null}

        <span>{children}</span>

        {!isLoading && rightIcon && (
          <span className={iconSizes[size]}>{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
