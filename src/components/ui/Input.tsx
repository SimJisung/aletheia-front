'use client';

import { forwardRef, useState, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'floating';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  label?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant = 'default',
    inputSize = 'md',
    error,
    leftIcon,
    rightIcon,
    label,
    hint,
    id,
    value,
    defaultValue,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));

    const sizeStyles = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-base',
      lg: 'h-13 px-5 text-lg',
    };

    const floatingSizeStyles = {
      sm: 'h-12 px-3 pt-5 pb-1 text-sm',
      md: 'h-14 px-4 pt-6 pb-2 text-base',
      lg: 'h-16 px-5 pt-7 pb-2 text-lg',
    };

    const variantStyles = {
      default: cn(
        'bg-[var(--color-bg-elevated)]',
        'border',
        error
          ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
          : 'border-[var(--color-border)] focus:border-[var(--color-border-focus)] focus:ring-primary-500/20'
      ),
      filled: cn(
        'bg-neutral-100 dark:bg-neutral-800',
        'border border-transparent',
        error
          ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
          : 'focus:bg-[var(--color-bg-elevated)] focus:border-[var(--color-border-focus)] focus:ring-primary-500/20'
      ),
      floating: cn(
        'bg-[var(--color-bg-tertiary)]',
        'border',
        error
          ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
          : 'border-[var(--color-border)] focus:border-[var(--color-border-focus)] focus:ring-primary-500/20'
      ),
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const iconPadding = {
      sm: { left: 'pl-9', right: 'pr-9' },
      md: { left: 'pl-10', right: 'pr-10' },
      lg: { left: 'pl-12', right: 'pr-12' },
    };

    // Floating label variant
    if (variant === 'floating') {
      const isFloating = isFocused || hasValue;

      return (
        <div className="w-full space-y-1.5">
          <div className="relative">
            <input
              ref={ref}
              id={inputId}
              value={value}
              defaultValue={defaultValue}
              className={cn(
                'peer w-full rounded-xl',
                'transition-all duration-200',
                'text-[var(--color-text-primary)]',
                'placeholder-transparent',
                'focus:outline-none focus:ring-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                floatingSizeStyles[inputSize],
                variantStyles[variant],
                className
              )}
              placeholder={label || ' '}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                setHasValue(e.target.value !== '');
                props.onBlur?.(e);
              }}
              onChange={(e) => {
                setHasValue(e.target.value !== '');
                props.onChange?.(e);
              }}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
              {...props}
            />
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'absolute left-4 transition-all duration-200 pointer-events-none',
                  'text-[var(--color-text-muted)]',
                  isFloating
                    ? 'top-2 text-xs text-primary-500 dark:text-primary-400 font-medium'
                    : 'top-1/2 -translate-y-1/2 text-base'
                )}
              >
                {label}
              </label>
            )}

            {error && (
              <div className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-error-500',
                iconSizes[inputSize]
              )}>
                <AlertCircle className="w-full h-full" />
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.p
                id={`${inputId}-error`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm text-error-500 flex items-center gap-1"
                role="alert"
              >
                {error}
              </motion.p>
            ) : hint ? (
              <motion.p
                id={`${inputId}-hint`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-[var(--color-text-muted)]"
              >
                {hint}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      );
    }

    // Default and filled variants
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2',
              'text-[var(--color-text-muted)]',
              iconSizes[inputSize]
            )}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              'w-full rounded-xl',
              'transition-all duration-200',
              'text-[var(--color-text-primary)]',
              'placeholder:text-[var(--color-text-muted)]',
              'focus:outline-none focus:ring-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeStyles[inputSize],
              variantStyles[variant],
              leftIcon && iconPadding[inputSize].left,
              (rightIcon || error) && iconPadding[inputSize].right,
              className
            )}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {rightIcon && !error && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'text-[var(--color-text-muted)]',
              iconSizes[inputSize]
            )}>
              {rightIcon}
            </div>
          )}

          {error && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-error-500',
              iconSizes[inputSize]
            )}>
              <AlertCircle className="w-full h-full" />
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              id={`${inputId}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-sm text-error-500 flex items-center gap-1"
              role="alert"
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              id={`${inputId}-hint`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[var(--color-text-muted)]"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled';
  textareaSize?: 'sm' | 'md' | 'lg';
  error?: string;
  label?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant = 'default',
    textareaSize = 'md',
    error,
    label,
    hint,
    id,
    ...props
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    const variantStyles = {
      default: cn(
        'bg-white dark:bg-neutral-900',
        'border',
        error
          ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
          : 'border-neutral-300 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20'
      ),
      filled: cn(
        'bg-neutral-100 dark:bg-neutral-800',
        'border border-transparent',
        error
          ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
          : 'focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:ring-primary-500/20'
      ),
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-xl',
            'transition-all duration-200',
            'text-neutral-900 dark:text-neutral-100',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
            'focus:outline-none focus:ring-2',
            'resize-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeStyles[textareaSize],
            variantStyles[variant],
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />

        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              id={`${textareaId}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-sm text-error-500 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              id={`${textareaId}-hint`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-neutral-500 dark:text-neutral-400"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
