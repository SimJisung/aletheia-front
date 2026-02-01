'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Skeleton } from '@/components/ui';
import { valuesApi } from '@/lib/api';
import { VALUE_AXIS_META, ALL_VALUE_AXES, type ValueAxis } from '@/types';
import { cn } from '@/lib/utils';

interface ValueImportanceEditorProps {
  onSaved?: () => void;
}

export function ValueImportanceEditor({ onSaved }: ValueImportanceEditorProps) {
  const [importance, setImportance] = useState<Record<ValueAxis, number>>(() => {
    const initial: Record<ValueAxis, number> = {} as Record<ValueAxis, number>;
    ALL_VALUE_AXES.forEach((axis) => {
      initial[axis] = 5; // 기본값 5 (중간)
    });
    return initial;
  });
  const [originalImportance, setOriginalImportance] = useState<Record<ValueAxis, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadImportance = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await valuesApi.getImportance(signal);

      const loadedImportance: Record<ValueAxis, number> = {} as Record<ValueAxis, number>;
      ALL_VALUE_AXES.forEach((axis) => {
        loadedImportance[axis] = data.importance[axis] ?? 5;
      });

      setImportance(loadedImportance);
      setOriginalImportance(loadedImportance);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Failed to load importance:', err);
      // 404면 아직 설정한 적 없음 - 기본값 사용
      const defaultImportance: Record<ValueAxis, number> = {} as Record<ValueAxis, number>;
      ALL_VALUE_AXES.forEach((axis) => {
        defaultImportance[axis] = 5;
      });
      setOriginalImportance(defaultImportance);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadImportance(controller.signal);
    return () => controller.abort();
  }, [loadImportance]);

  const handleSliderChange = (axis: ValueAxis, value: number) => {
    setImportance((prev) => ({ ...prev, [axis]: value }));
    setSuccessMessage(null);
  };

  const hasChanges = originalImportance &&
    ALL_VALUE_AXES.some((axis) => importance[axis] !== originalImportance[axis]);

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 변경된 값만 전송
      const changedValues: Partial<Record<ValueAxis, number>> = {};
      ALL_VALUE_AXES.forEach((axis) => {
        if (originalImportance && importance[axis] !== originalImportance[axis]) {
          changedValues[axis] = importance[axis];
        }
      });

      const result = await valuesApi.setImportance({ importance: changedValues });

      // 응답으로 전체 상태 업데이트
      const updatedImportance: Record<ValueAxis, number> = {} as Record<ValueAxis, number>;
      ALL_VALUE_AXES.forEach((axis) => {
        updatedImportance[axis] = result.importance[axis] ?? 5;
      });

      setImportance(updatedImportance);
      setOriginalImportance(updatedImportance);
      setSuccessMessage('가치 중요도가 저장되었습니다.');
      onSaved?.();
    } catch (err) {
      console.error('Failed to save importance:', err);
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (originalImportance) {
      setImportance({ ...originalImportance });
    }
    setSuccessMessage(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        각 가치가 당신에게 얼마나 중요한지 1~10 척도로 설정하세요.
        이 설정은 결정 분석 시 가치 정렬 계산에 반영됩니다.
      </div>

      <div className="space-y-4">
        {ALL_VALUE_AXES.map((axis) => {
          const meta = VALUE_AXIS_META[axis];
          const value = importance[axis];

          return (
            <div key={axis} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{meta.icon}</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {meta.displayNameKo}
                  </span>
                </div>
                <span
                  className={cn(
                    'text-sm font-semibold min-w-[2rem] text-right',
                    value >= 7 ? 'text-primary-600' :
                    value <= 3 ? 'text-neutral-400' :
                    'text-neutral-600 dark:text-neutral-300'
                  )}
                >
                  {value}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 w-4">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={value}
                  onChange={(e) => handleSliderChange(axis, parseInt(e.target.value, 10))}
                  className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary-500
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-primary-500
                    [&::-moz-range-thumb]:border-none
                    [&::-moz-range-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary-500) 0%, var(--color-primary-500) ${(value - 1) / 9 * 100}%, var(--color-neutral-200) ${(value - 1) / 9 * 100}%, var(--color-neutral-200) 100%)`
                  }}
                />
                <span className="text-xs text-neutral-400 w-4">10</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-6">
                {meta.description}
              </p>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={isSaving}
          disabled={!hasChanges || isSaving}
        >
          저장
        </Button>
        {hasChanges && (
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isSaving}
          >
            되돌리기
          </Button>
        )}
      </div>
    </div>
  );
}
