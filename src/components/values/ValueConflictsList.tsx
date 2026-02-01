'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, EmptyState, Skeleton, Button } from '@/components/ui';
import { valuesApi } from '@/lib/api';
import { MESSAGES } from '@/lib/constants/messages';
import { VALUE_AXIS_META, type ValueConflict } from '@/types';

export function ValueConflictsList() {
  const [conflicts, setConflicts] = useState<ValueConflict[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConflicts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await valuesApi.getConflicts();
      setConflicts(data);
    } catch (err) {
      console.error('Failed to load conflicts:', err);
      setError(MESSAGES.errors.loadConflicts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConflicts();
  }, [loadConflicts]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<span className="text-4xl">⚠️</span>}
        title="데이터를 불러올 수 없어요"
        description={error}
        action={
          <Button variant="outline" onClick={loadConflicts}>
            {MESSAGES.actions.retry}
          </Button>
        }
      />
    );
  }

  if (conflicts.length === 0) {
    return (
      <EmptyState
        icon={<span className="text-4xl">✨</span>}
        title={MESSAGES.empty.conflicts.title}
        description={MESSAGES.empty.conflicts.description}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 안내 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          ℹ️ 가치 간 긴장은 자연스러운 현상입니다. 사람은 누구나 여러 가치를 동시에 추구하며, 때로는 이들이 충돌하기도 합니다.
        </p>
      </div>

      {/* 긴장 목록 */}
      {conflicts.map((conflict, index) => {
        const axis1Key = conflict.axis1 as keyof typeof VALUE_AXIS_META;
        const axis2Key = conflict.axis2 as keyof typeof VALUE_AXIS_META;
        const fromMeta = VALUE_AXIS_META[axis1Key];
        const toMeta = VALUE_AXIS_META[axis2Key];
        const strengthBars = Math.ceil(conflict.strength * 5);

        return (
          <Card key={index} variant="default" padding="md">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{fromMeta.icon}</span>
                  <span className="text-neutral-400">⟷</span>
                  <span className="text-2xl">{toMeta.icon}</span>
                  <div>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {fromMeta.displayNameKo}
                    </span>
                    <span className="text-neutral-400 mx-2">↔</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {toMeta.displayNameKo}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-500 mr-2">강도</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-4 rounded-sm ${
                        i < strengthBars
                          ? 'bg-amber-500'
                          : 'bg-neutral-200 dark:bg-neutral-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {conflict.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {conflict.description}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
