'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { valuesApi } from '@/lib/api';
import { VALUE_AXIS_META, trendToIcon, type ValueSummary } from '@/types';

interface ValueSummaryCardProps {
  summary?: ValueSummary;
}

export function ValueSummaryCard({ summary: initialSummary }: ValueSummaryCardProps) {
  const [summary, setSummary] = useState<ValueSummary | null>(initialSummary || null);
  const [isLoading, setIsLoading] = useState(!initialSummary);

  useEffect(() => {
    if (!initialSummary) {
      loadSummary();
    }
  }, [initialSummary]);

  const loadSummary = async () => {
    try {
      const data = await valuesApi.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load value summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card variant="bordered" padding="md">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    );
  }

  if (!summary) return null;

  const topPositive = summary.topPositiveValues[0];
  const topPositiveMeta = topPositive ? VALUE_AXIS_META[topPositive.axis] : null;

  return (
    <Card variant="bordered" padding="md">
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
                <span className="ml-2 text-success-600">
                  +{topPositive.avgValence.toFixed(1)}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-700">
          <div>
            <p className="text-sm text-neutral-500">총 기록 수</p>
            <p className="text-lg font-semibold">
              {Math.round(summary.totalFragmentCount)}개
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
