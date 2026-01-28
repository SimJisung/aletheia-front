'use client';

import { useState } from 'react';
import { Card, CardContent, Button, Textarea } from '@/components/ui';
import { MoodSelector } from './MoodSelector';
import { TopicSelector } from './TopicSelector';
import { fragmentsApi } from '@/lib/api';
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
  const [text, setText] = useState('');
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('생각을 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const fragment = await fragmentsApi.create({
        text: text.trim(),
        topicHint: topic || undefined,
      });

      setText('');
      setMood(null);
      setTopic(null);
      onSuccess?.(fragment);
    } catch (err) {
      setError('기록 저장에 실패했습니다. 다시 시도해주세요.');
      console.error('Failed to create fragment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMood = mood ? MOOD_OPTIONS.find((m) => m.level === mood) : null;

  return (
    <Card variant="bordered" padding={compact ? 'sm' : 'md'}>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* 텍스트 입력 */}
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={compact ? 3 : 4}
            error={error || undefined}
            disabled={isSubmitting}
          />

          {/* 기분 선택 */}
          {showMoodSelector && (
            <div className="space-y-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                오늘 기분은 어떠신가요?
              </p>
              <MoodSelector
                value={mood}
                onChange={setMood}
                size={compact ? 'sm' : 'md'}
              />
            </div>
          )}

          {/* 주제 선택 */}
          {showTopicSelector && (
            <div className="space-y-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                관련 주제 (선택)
              </p>
              <TopicSelector value={topic} onChange={setTopic} />
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-neutral-400">
              {selectedMood && (
                <span>
                  {selectedMood.emoji} {selectedMood.label}
                </span>
              )}
            </div>
            <Button type="submit" isLoading={isSubmitting} disabled={!text.trim()}>
              기록하기
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
