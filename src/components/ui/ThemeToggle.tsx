'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeOption {
  value: Theme;
  icon: React.ReactNode;
  label: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'light', icon: <Sun size={16} />, label: 'Light' },
  { value: 'dark', icon: <Moon size={16} />, label: 'Dark' },
  { value: 'system', icon: <Monitor size={16} />, label: 'System' },
];

interface ThemeToggleProps {
  showLabels?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabels = true, className = '' }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton placeholder to prevent layout shift
    return (
      <div
        className={`flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 ${className}`}
        style={{ width: showLabels ? '156px' : '108px', height: '36px' }}
      />
    );
  }

  return (
    <div
      className={`flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 ${className}`}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themeOptions.map((option) => {
        const isActive = theme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`
              relative flex items-center justify-center gap-1.5 px-3 py-1.5
              rounded-lg text-sm font-medium transition-colors duration-200
              ${isActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }
            `}
            role="radio"
            aria-checked={isActive}
            aria-label={`${option.label} theme`}
          >
            {isActive && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-white dark:bg-neutral-700 rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center">
              {option.icon}
            </span>
            {showLabels && (
              <span className="relative z-10 hidden sm:inline">
                {option.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Compact version for mobile/small spaces
export function ThemeToggleCompact({ className = '' }: { className?: string }) {
  return <ThemeToggle showLabels={false} className={className} />;
}
