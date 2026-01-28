'use client';

import { cn } from '@/lib/utils';
import { TOPIC_PRESETS, type TopicPreset } from '@/types';

interface TopicSelectorProps {
  value: string | null;
  onChange: (topic: string | null) => void;
  allowCustom?: boolean;
}

export function TopicSelector({ value, onChange, allowCustom = true }: TopicSelectorProps) {
  const isCustom = value && !TOPIC_PRESETS.some((t) => t.id === value);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {TOPIC_PRESETS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onChange(value === topic.id ? null : topic.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
              'border transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              value === topic.id
                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500'
            )}
            aria-pressed={value === topic.id}
          >
            <span>{topic.icon}</span>
            <span>{topic.label}</span>
          </button>
        ))}

        {allowCustom && (
          <button
            type="button"
            onClick={() => {
              const custom = prompt('주제를 입력하세요:');
              if (custom) onChange(custom);
            }}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
              'border border-dashed transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              isCustom
                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400'
            )}
          >
            <span>+</span>
            <span>{isCustom ? value : '직접 입력'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
