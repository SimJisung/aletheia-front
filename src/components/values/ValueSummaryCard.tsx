'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton, Button } from '@/components/ui';
import { valuesApi } from '@/lib/api';
import { MESSAGES } from '@/lib/constants/messages';
import { VALUE_AXIS_META, trendToIcon, type ValueSummary } from '@/types';

interface ValueSummaryCardProps {
  summary?: ValueSummary;
}

export function ValueSummaryCard({ summary: initialSummary }: ValueSummaryCardProps) {
  const [summary, setSummary] = useState<ValueSummary | null>(initialSummary || null);
  const [isLoading, setIsLoading] = useState(!initialSummary);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await valuesApi.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load value summary:', err);
      setError(MESSAGES.errors.loadSummary);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialSummary) {
      loadSummary();
    }
  }, [initialSummary, loadSummary]);

  if (isLoading) {
    return (
      <Card variant="default" padding="md">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="default" padding="md">
        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={loadSummary}>
            {MESSAGES.actions.retry}
          </Button>
        </div>
      </Card>
    );
  }

  if (!summary) return null;

  // topPositiveValues는 ValueAxis 이름 문자열 배열 (예: ["GROWTH", "HEALTH"])
  const topPositiveAxis = summary.topPositiveValues[0] as keyof typeof VALUE_AXIS_META | undefined;
  const topPositiveMeta = topPositiveAxis ? VALUE_AXIS_META[topPositiveAxis] : null;

  return (
    <Card variant="default" padding="md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💎 가치 요약
          <span className="text-sm font-normal text-neutral-500">
            {trendToIcon(summary.dominantTrend)} {summary.dominantTrend === 'RISING' ? '상승 중' : summary.dominantTrend === 'FALLING' ? '하락 중' : '안정'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 가장 긍정적인 가치 */}
        {topPositiveMeta && (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{topPositiveMeta.icon}</span>
            <div>
              <p className="text-sm text-neutral-500">가장 긍정적인 가치</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {topPositiveMeta.displayNameKo}
              </p>
            </div>
          </div>
        )}

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-700">
          <div>
            <p className="text-sm text-neutral-500">총 기록 수</p>
            <p className="text-lg font-semibold">
              {summary.totalFragments}개
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">가치 긴장</p>
            <p className="text-lg font-semibold">
              {summary.conflictCount}개
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
