'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Skeleton } from '@/components/ui';
import { FragmentInputForm, FragmentCard } from '@/components/fragments';
import { DecisionCard, FeedbackButtons } from '@/components/decisions';
import { ValueSummaryCard, ValueRadarChart } from '@/components/values';
import { fragmentsApi, decisionsApi, valuesApi } from '@/lib/api';
import type { ThoughtFragment, Decision, ValueGraph, ValueSummary } from '@/types';

export default function DashboardPage() {
  const [recentFragments, setRecentFragments] = useState<ThoughtFragment[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<Decision[]>([]);
  const [valueGraph, setValueGraph] = useState<ValueGraph | null>(null);
  const [valueSummary, setValueSummary] = useState<ValueSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [fragmentsRes, pendingRes, graphRes, summaryRes] = await Promise.all([
        fragmentsApi.list(5, 0),
        decisionsApi.getPendingFeedback(),
        valuesApi.getGraph(),
        valuesApi.getSummary(),
      ]);
      setRecentFragments(fragmentsRes.fragments);
      setPendingFeedback(pendingRes);
      setValueGraph(graphRes);
      setValueSummary(summaryRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFragmentCreated = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 인사 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          안녕하세요 👋
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          오늘도 당신의 생각을 기록해보세요
        </p>
      </div>

      {/* 피드백 대기 배너 */}
      {pendingFeedback.length > 0 && (
        <Card variant="bordered" padding="md" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  💬 피드백이 필요한 결정이 {pendingFeedback.length}개 있어요
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  "{pendingFeedback[0].title}"
                </p>
              </div>
              <Link href={`/decisions/${pendingFeedback[0].id}`}>
                <Button size="sm">피드백 작성 →</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 빠른 기록 */}
      <FragmentInputForm
        onSuccess={handleFragmentCreated}
        placeholder="지금 떠오르는 생각을 자유롭게 적어보세요..."
        compact
      />

      {/* 메인 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 가치 그래프 */}
        <Card variant="bordered" padding="md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>💎 나의 가치 지도</CardTitle>
              <Link href="/values">
                <Button variant="ghost" size="sm">자세히 →</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {valueGraph && valueGraph.nodes.length > 0 ? (
              <ValueRadarChart nodes={valueGraph.nodes} />
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <p className="text-4xl mb-2">🌱</p>
                <p>더 많은 기록을 남기면</p>
                <p>가치 지도가 형성됩니다</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 최근 기록 */}
        <Card variant="bordered" padding="md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>📝 최근 기록</CardTitle>
              <Link href="/fragments">
                <Button variant="ghost" size="sm">전체 보기 →</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentFragments.length > 0 ? (
              <div className="space-y-3">
                {recentFragments.slice(0, 3).map((fragment) => (
                  <FragmentCard key={fragment.id} fragment={fragment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <p className="text-4xl mb-2">✨</p>
                <p>첫 번째 생각을 기록해보세요</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 가치 요약 */}
      {valueSummary && valueSummary.totalFragmentCount > 0 && (
        <ValueSummaryCard summary={valueSummary} />
      )}

      {/* 빠른 액션 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/fragments">
          <Card variant="bordered" padding="sm" className="hover:border-primary-300 transition-colors text-center">
            <CardContent className="py-4">
              <span className="text-2xl">📝</span>
              <p className="mt-2 font-medium text-sm">생각 기록</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/decisions/new">
          <Card variant="bordered" padding="sm" className="hover:border-primary-300 transition-colors text-center">
            <CardContent className="py-4">
              <span className="text-2xl">🎯</span>
              <p className="mt-2 font-medium text-sm">새 결정</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/values">
          <Card variant="bordered" padding="sm" className="hover:border-primary-300 transition-colors text-center">
            <CardContent className="py-4">
              <span className="text-2xl">💎</span>
              <p className="mt-2 font-medium text-sm">가치 지도</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/fragments?tab=search">
          <Card variant="bordered" padding="sm" className="hover:border-primary-300 transition-colors text-center">
            <CardContent className="py-4">
              <span className="text-2xl">🔍</span>
              <p className="mt-2 font-medium text-sm">기록 검색</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
