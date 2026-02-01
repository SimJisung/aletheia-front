'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TOPIC_PRESETS } from '@/types';
import { isPresetTopic } from '@/lib/utils/topics';
import { CustomTopicModal } from './CustomTopicModal';

interface TopicSelectorProps {
  value: string[];
  onChange: (topics: string[]) => void;
  allowCustom?: boolean;
  maxTopics?: number;
}

const DEFAULT_MAX_TOPICS = 5;

export function TopicSelector({
  value,
  onChange,
  allowCustom = true,
  maxTopics = DEFAULT_MAX_TOPICS,
}: TopicSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const customTopics = value.filter((t) => !isPresetTopic(t));
  const isMaxReached = value.length >= maxTopics;

  const handlePresetToggle = (topicId: string) => {
    if (value.includes(topicId)) {
      onChange(value.filter((t) => t !== topicId));
    } else if (!isMaxReached) {
      onChange([...value, topicId]);
    }
  };

  const handleCustomTopicAdd = (topic: string) => {
    if (!value.includes(topic) && !isMaxReached) {
      onChange([...value, topic]);
    }
  };

  const handleCustomTopicRemove = (topic: string) => {
    onChange(value.filter((t) => t !== topic));
  };

  const handleRemoveClick = (e: React.MouseEvent, topic: string) => {
    e.stopPropagation();
    handleCustomTopicRemove(topic);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {TOPIC_PRESETS.map((topic) => {
          const isSelected = value.includes(topic.id);
          const isDisabled = !isSelected && isMaxReached;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => handlePresetToggle(topic.id)}
              disabled={isDisabled}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                'border transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500',
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
              aria-pressed={isSelected}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          );
        })}

        {customTopics.map((topic) => (
          <button
            key={topic}
            type="button"
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
              'border border-solid border-primary-500 bg-primary-50 text-primary-700',
              'dark:bg-primary-900/30 dark:text-primary-300',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
            aria-label={`커스텀 주제: ${topic}`}
          >
            <span className="max-w-[120px] truncate">{topic}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => handleRemoveClick(e, topic)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCustomTopicRemove(topic);
                }
              }}
              className="ml-0.5 p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              aria-label={`${topic} 삭제`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        ))}

        {allowCustom && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            disabled={isMaxReached}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
              'border border-dashed border-neutral-300 dark:border-neutral-600',
              'text-neutral-500 dark:text-neutral-400',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              isMaxReached ? 'opacity-50 cursor-not-allowed' : 'hover:border-neutral-400'
            )}
            aria-label="직접 입력"
          >
            <span>+</span>
            <span>직접 입력</span>
          </button>
        )}
      </div>

      {isMaxReached && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          최대 {maxTopics}개까지 선택할 수 있습니다.
        </p>
      )}

      <CustomTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleCustomTopicAdd}
        existingTopics={value}
      />
    </div>
  );
}
