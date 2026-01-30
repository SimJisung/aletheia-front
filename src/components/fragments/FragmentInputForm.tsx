'use client';

import { useState, useId } from 'react';
import { Card, CardContent, Button, Textarea } from '@/components/ui';
import { MoodSelector } from './MoodSelector';
import { TopicSelector } from './TopicSelector';
import { fragmentsApi } from '@/lib/api';
import { useFormSubmit } from '@/hooks';
import { MOOD_OPTIONS, type MoodLevel, type ThoughtFragment } from '@/types';

interface FragmentInputFormProps {
  onSuccess?: (fragment: ThoughtFragment) => void;
  placeholder?: string;
  showMoodSelector?: boolean;
  showTopicSelector?: boolean;
  compact?: boolean;
}

export function FragmentInputForm({
  onSuccess,
  placeholder = '지금 떠오르는 생각을 자유롭게 적어보세요...',
  showMoodSelector = true,
  showTopicSelector = true,
  compact = false,
}: FragmentInputFormProps) {
  const formId = useId();
  const [text, setText] = useState('');
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { execute, isLoading, error: submitError, reset } = useFormSubmit(
    async () => {
      const fragment = await fragmentsApi.create({
        text: text.trim(),
        topicHint: topic || undefined,
      });
      return fragment;
    },
    {
      errorMessage: '기록 저장에 실패했습니다. 다시 시도해주세요.',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!text.trim()) {
      setValidationError('생각을 입력해주세요');
      return;
    }

    const result = await execute();
    if (result) {
      setText('');
      setMood(null);
      setTopic(null);
      reset();
      onSuccess?.(result);
    }
  };

  const selectedMood = mood ? MOOD_OPTIONS.find((m) => m.level === mood) : null;
  const error = validationError || submitError;

  return (
    <Card variant="bordered" padding={compact ? 'sm' : 'md'}>
      <form onSubmit={handleSubmit} aria-describedby={error ? `${formId}-error` : undefined}>
        <CardContent className="space-y-4">
          {/* 텍스트 입력 */}
          <div className="space-y-1">
            <label htmlFor={`${formId}-text`} className="sr-only">
              생각 입력
            </label>
            <Textarea
              id={`${formId}-text`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              rows={compact ? 3 : 4}
              error={error || undefined}
              disabled={isLoading}
              aria-required="true"
            />
          </div>

          {/* 기분 선택 */}
          {showMoodSelector && (
            <div className="space-y-2">
              <p id={`${formId}-mood-label`} className="text-sm text-neutral-500 dark:text-neutral-400">
                오늘 기분은 어떠신가요?
              </p>
              <MoodSelector
                value={mood}
                onChange={setMood}
                size={compact ? 'sm' : 'md'}
                aria-labelledby={`${formId}-mood-label`}
              />
            </div>
          )}

          {/* 주제 선택 */}
          {showTopicSelector && (
            <div className="space-y-2">
              <p id={`${formId}-topic-label`} className="text-sm text-neutral-500 dark:text-neutral-400">
                관련 주제 (선택)
              </p>
              <TopicSelector
                value={topic}
                onChange={setTopic}
                aria-labelledby={`${formId}-topic-label`}
              />
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-neutral-400" aria-live="polite">
              {selectedMood && (
                <span>
                  <span aria-hidden="true">{selectedMood.emoji}</span> {selectedMood.label}
                </span>
              )}
            </div>
            <Button type="submit" isLoading={isLoading} disabled={!text.trim()}>
              기록하기
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
