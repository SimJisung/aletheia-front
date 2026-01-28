'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Skeleton } from '@/components/ui';
import { ValueSummaryCard, ValueAxesGrid, ValueRadarChart, ValueConflictsList } from '@/components/values';
import { valuesApi } from '@/lib/api';
import type { ValueGraph, ValueSummary } from '@/types';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'conflicts';

export default function ValuesPage() {
  const [graph, setGraph] = useState<ValueGraph | null>(null);
  const [summary, setSummary] = useState<ValueSummary | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [graphData, summaryData] = await Promise.all([
          valuesApi.getGraph(),
          valuesApi.getSummary(),
        ]);
        setGraph(graphData);
        setSummary(summaryData);
      } catch (err) {
        console.error('Failed to load value data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'overview'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          )}
        >
          전체 보기
        </button>
        <button
          onClick={() => setActiveTab('conflicts')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'conflicts'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          )}
        >
          ⚡ 가치 긴장
          {summary && summary.conflictCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
              {summary.conflictCount}
            </span>
          )}
        </button>
      </div>

      {/* 컨텐츠 */}
      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* 레이더 차트 */}
          {graph && (
            <Card variant="bordered" padding="md">
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
        </div>
      ) : (
        <ValueConflictsList />
      )}
    </div>
  );
}
