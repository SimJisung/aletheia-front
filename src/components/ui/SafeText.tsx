'use client';

import { sanitizeText } from '@/lib/sanitize';
import { cn } from '@/lib/utils';

interface SafeTextProps {
  children: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * Safely renders user-generated or AI-generated text content
 * Automatically sanitizes content to prevent XSS attacks
 */
export function SafeText({ children, className, as: Component = 'p' }: SafeTextProps) {
  const sanitized = sanitizeText(children);

  return (
    <Component className={cn('whitespace-pre-wrap', className)}>
      {sanitized}
    </Component>
  );
}
