'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useId,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  baseId: string;
  variant: 'underline' | 'pills' | 'boxed';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'underline' | 'pills' | 'boxed';
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant = 'underline',
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const baseId = useId();

  const activeTab = value ?? internalValue;
  const setActiveTab = useCallback(
    (id: string) => {
      setInternalValue(id);
      onValueChange?.(id);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId, variant }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function TabList({ children, className, 'aria-label': ariaLabel }: TabListProps) {
  const { variant } = useTabsContext();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    const currentIndex = Array.from(tabs).findIndex((tab) => tab === document.activeElement);

    let nextIndex: number | null = null;

    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      tabs[nextIndex].focus();
    }
  };

  const variantStyles = {
    underline: 'border-b border-neutral-200 dark:border-neutral-800',
    pills: 'p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl',
    boxed: 'p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl',
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex gap-1',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabTrigger({ value, children, className, disabled }: TabTriggerProps) {
  const { activeTab, setActiveTab, baseId, variant } = useTabsContext();
  const isActive = activeTab === value;
  const ref = useRef<HTMLButtonElement>(null);

  const baseStyles = cn(
    'relative px-4 py-2 text-sm font-medium',
    'transition-colors duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const variantStyles = {
    underline: cn(
      '-mb-px',
      isActive
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
    ),
    pills: cn(
      'rounded-lg z-10',
      isActive
        ? 'text-primary-700 dark:text-white'
        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
    ),
    boxed: cn(
      'rounded-lg z-10 flex-1',
      isActive
        ? 'text-neutral-900 dark:text-white'
        : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
    ),
  };

  return (
    <button
      ref={ref}
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {children}

      {/* Animated indicator for underline variant */}
      {variant === 'underline' && isActive && (
        <motion.div
          layoutId={`${baseId}-indicator`}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* Animated background for pills/boxed variant */}
      {(variant === 'pills' || variant === 'boxed') && isActive && (
        <motion.div
          layoutId={`${baseId}-bg`}
          className="absolute inset-0 bg-white dark:bg-neutral-700 rounded-lg shadow-elevation-sm -z-10"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={value}
          role="tabpanel"
          id={`${baseId}-panel-${value}`}
          aria-labelledby={`${baseId}-tab-${value}`}
          tabIndex={0}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn('focus:outline-none', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
