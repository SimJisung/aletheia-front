'use client';

import { useState } from 'react';
import { decisionsApi, ApiError } from '@/lib/api';
import { FEEDBACK_OPTIONS, type FeedbackType, type FeedbackResponse } from '@/types';
import { cn } from '@/lib/utils';

interface FeedbackButtonsProps {
  decisionId: string;
  onSuccess?: (response?: FeedbackResponse) => void;
}

export function FeedbackButtons({ decisionId, onSuccess }: FeedbackButtonsProps) {
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResponse | null>(null);

  const handleSubmit = async (type: FeedbackType) => {
    if (isLoading || isAlreadySubmitted) return;

    setSelectedType(type);
    setIsLoading(true);
    setError(null);

    try {
      const response = await decisionsApi.submitFeedback(decisionId, { feedbackType: type });
      setFeedbackResult(response);
      onSuccess?.(response);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setIsAlreadySubmitted(true);
        setError('이미 피드백이 제출되었습니다.');
        onSuccess?.();
      } else {
        setSelectedType(null);
        setError('피드백 제출에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
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
            disabled={isLoading || feedbackResult !== null}
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

      {/* 피드백 제출 결과 - Impact 정보 표시 */}
      {feedbackResult && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
            ✓ 피드백이 반영되었습니다
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            {feedbackResult.impact.effectDescription}
          </p>
          {feedbackResult.impact.stats && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              총 {feedbackResult.impact.stats.totalWithFeedback}개의 피드백 중
              만족 {feedbackResult.impact.stats.satisfiedCount}개,
              보통 {feedbackResult.impact.stats.neutralCount}개,
              아쉬움 {feedbackResult.impact.stats.regretCount}개
            </p>
          )}
        </div>
      )}
    </div>
  );
}
