'use client';

import { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea } from '@/components/ui';
import { decisionsApi } from '@/lib/api';
import { useFormSubmit } from '@/hooks';
import { ALL_VALUE_AXES, VALUE_AXIS_META, type ValueAxis } from '@/types';
import { cn } from '@/lib/utils';

export function DecisionInputForm() {
  const router = useRouter();
  const formId = useId();

  const [title, setTitle] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [priorityAxis, setPriorityAxis] = useState<ValueAxis | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { execute, isLoading, error: submitError } = useFormSubmit(
    async () => {
      const decision = await decisionsApi.create({
        title: title.trim(),
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        priorityAxis: priorityAxis || undefined,
      });
      return decision;
    },
    {
      errorMessage: '결정 분석에 실패했습니다. 다시 시도해주세요.',
      onSuccess: () => {
        // Navigation happens after success
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim() || !optionA.trim() || !optionB.trim()) {
      setValidationError('모든 필드를 입력해주세요');
      return;
    }

    const result = await execute();
    if (result) {
      router.push(`/decisions/${result.id}`);
    }
  };

  const error = validationError || submitError;

  return (
    <Card variant="bordered" padding="lg">
      <CardHeader>
        <CardTitle>새로운 결정 분석하기</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} aria-describedby={error ? `${formId}-error` : undefined}>
        <CardContent className="space-y-6">
          {/* 결정 제목 */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-title`}
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              어떤 결정을 고민하고 계신가요?
            </label>
            <Input
              id={`${formId}-title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 새 직장 제안을 받아들일까?"
              error={validationError && !title.trim() ? '제목을 입력해주세요' : undefined}
              aria-required="true"
            />
          </div>

          {/* 옵션 A, B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-optionA`}
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                선택지 A
              </label>
              <Textarea
                id={`${formId}-optionA`}
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="예: 제안을 수락한다 (높은 연봉, 더 큰 책임)"
                rows={3}
                error={validationError && !optionA.trim() ? '선택지 A를 입력해주세요' : undefined}
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-optionB`}
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                선택지 B
              </label>
              <Textarea
                id={`${formId}-optionB`}
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="예: 현재 직장에 남는다 (안정적, 스트레스 적음)"
                rows={3}
                error={validationError && !optionB.trim() ? '선택지 B를 입력해주세요' : undefined}
                aria-required="true"
              />
            </div>
          </div>

          {/* 우선 가치 선택 */}
          <fieldset className="space-y-3">
            <legend className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              이 결정에서 가장 중요한 가치는? (선택사항)
            </legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="가치 선택">
              {ALL_VALUE_AXES.map((axis) => {
                const meta = VALUE_AXIS_META[axis];
                const isSelected = priorityAxis === axis;
                return (
                  <button
                    key={axis}
                    type="button"
                    onClick={() => setPriorityAxis(isSelected ? null : axis)}
                    aria-pressed={isSelected}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                      'border transition-all duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400'
                    )}
                  >
                    <span aria-hidden="true">{meta.icon}</span>
                    <span>{meta.displayNameKo}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 에러 메시지 */}
          {error && (
            <p id={`${formId}-error`} className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {/* 제출 버튼 */}
          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isLoading} size="lg">
              분석하기
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
