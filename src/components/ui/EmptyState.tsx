'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-neutral-300 dark:text-neutral-600">{icon}</div>
      )}
      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
