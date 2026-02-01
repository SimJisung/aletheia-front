'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'symbol' | 'wordmark';
  animated?: boolean;
  className?: string;
}

const sizes = {
  sm: { symbol: 24, wordmark: 'text-lg' },
  md: { symbol: 32, wordmark: 'text-xl' },
  lg: { symbol: 40, wordmark: 'text-2xl' },
  xl: { symbol: 56, wordmark: 'text-3xl' },
};

export function Logo({
  size = 'md',
  variant = 'full',
  animated = false,
  className
}: LogoProps) {
  const { symbol: symbolSize, wordmark: wordmarkClass } = sizes[size];

  const symbolVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const glowVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const Symbol = () => (
    <motion.svg
      width={symbolSize}
      height={symbolSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      variants={animated ? symbolVariants : undefined}
      initial="initial"
      whileHover="hover"
      className="flex-shrink-0"
    >
      {/* Outer triangle - represents revelation/truth */}
      <path
        d="M24 4L44 40H4L24 4Z"
        className="fill-primary-600 dark:fill-primary-500"
      />

      {/* Inner glow circle - represents insight */}
      <motion.circle
        cx="24"
        cy="28"
        r="6"
        className="fill-white dark:fill-primary-200"
        variants={animated ? glowVariants : undefined}
        initial="initial"
        animate="animate"
      />

      {/* Inner eye/light detail */}
      <circle
        cx="24"
        cy="28"
        r="2.5"
        className="fill-primary-600 dark:fill-primary-700"
      />
    </motion.svg>
  );

  const Wordmark = () => (
    <span
      className={clsx(
        'font-display font-semibold tracking-tight',
        'text-neutral-900 dark:text-white',
        wordmarkClass
      )}
    >
      aletheia
    </span>
  );

  if (variant === 'symbol') {
    return (
      <div className={clsx('inline-flex items-center', className)}>
        <Symbol />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={clsx('inline-flex items-center', className)}>
        <Wordmark />
      </div>
    );
  }

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <Symbol />
      <Wordmark />
    </div>
  );
}

export default Logo;
