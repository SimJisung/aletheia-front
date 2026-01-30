'use client';

import { useState } from 'react';
import { decisionsApi } from '@/lib/api';
import { useFormSubmit } from '@/hooks';
import { FEEDBACK_OPTIONS, type FeedbackType } from '@/types';
import { cn } from '@/lib/utils';

interface FeedbackButtonsProps {
  decisionId: string;
  onSuccess?: () => void;
}

export function FeedbackButtons({ decisionId, onSuccess }: FeedbackButtonsProps) {
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);

  const { execute, isLoading, error } = useFormSubmit(
    async (type: FeedbackType) => {
      await decisionsApi.submitFeedback(decisionId, { feedbackType: type });
      return type;
    },
    {
      errorMessage: '피드백 제출에 실패했습니다. 다시 시도해주세요.',
      onSuccess,
    }
  );

  const handleSubmit = async (type: FeedbackType) => {
    setSelectedType(type);
    const result = await execute(type);
    if (!result) {
      setSelectedType(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="font-medium text-neutral-900 dark:text-neutral-100">
          결정 후 어떠셨나요?
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          피드백은 더 나은 분석을 위해 사용됩니다
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-center gap-3" role="group" aria-label="피드백 선택">
        {FEEDBACK_OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => handleSubmit(option.type)}
            disabled={isLoading}
            aria-pressed={selectedType === option.type}
            aria-label={`${option.label} 피드백 제출`}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
              'hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              selectedType === option.type
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                : 'border-neutral-200 dark:border-neutral-700'
            )}
          >
            <span className="text-3xl" aria-hidden="true">{option.emoji}</span>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
