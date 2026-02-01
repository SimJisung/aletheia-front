'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Skeleton, Tabs, TabList, TabTrigger, TabPanel, EmptyState, Button } from '@/components/ui';
import { ValueSummaryCard, ValueAxesGrid, ValueRadarChart, ValueConflictsList } from '@/components/values';
import { valuesApi } from '@/lib/api';
import { MESSAGES } from '@/lib/constants/messages';
import type { ValueGraph, ValueSummary } from '@/types';

export default function ValuesPage() {
  const [graph, setGraph] = useState<ValueGraph | null>(null);
  const [summary, setSummary] = useState<ValueSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      const [graphData, summaryData] = await Promise.all([
        valuesApi.getGraph(signal),
        valuesApi.getSummary(signal),
      ]);
      setGraph(graphData);
      setSummary(summaryData);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(MESSAGES.errors.loadValue);
      console.error('Failed to load value data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
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
          <Button variant="outline" onClick={() => loadData()}>
            {MESSAGES.actions.retry}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          💎 나의 가치 지도
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          기록을 통해 형성된 당신의 가치관을 살펴보세요
        </p>
      </div>

      {/* 요약 카드 */}
      {summary && <ValueSummaryCard summary={summary} />}

      {/* 탭 */}
      <Tabs defaultValue="overview">
        <TabList aria-label="가치 지도 탭">
          <TabTrigger value="overview">전체 보기</TabTrigger>
          <TabTrigger value="conflicts">
            ⚡ 가치 긴장
            {summary && summary.conflictCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                {summary.conflictCount}
              </span>
            )}
          </TabTrigger>
        </TabList>

        {/* 컨텐츠 */}
        <TabPanel value="overview" className="mt-6 space-y-6">
          {/* 레이더 차트 */}
          {graph && (
            <Card variant="default" padding="md">
              <CardContent>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  가치 분포
                </h3>
                <ValueRadarChart nodes={graph.nodes} />
              </CardContent>
            </Card>
          )}

          {/* 8가지 가치 그리드 */}
          {graph && (
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                8가지 가치
              </h3>
              <ValueAxesGrid nodes={graph.nodes} />
            </div>
          )}
        </TabPanel>

        <TabPanel value="conflicts" className="mt-6">
          <ValueConflictsList />
        </TabPanel>
      </Tabs>
    </div>
  );
}
