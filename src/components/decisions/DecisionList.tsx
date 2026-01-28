'use client';

import { useState, useEffect } from 'react';
import { DecisionCard } from './DecisionCard';
import { Button, EmptyState, SkeletonList, Badge } from '@/components/ui';
import { decisionsApi } from '@/lib/api';
import { isPendingFeedback, type Decision } from '@/types';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'pending' | 'completed';

export function DecisionList() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);

  const loadDecisions = async (offset = 0) => {
    try {
      setIsLoading(true);
      const [listResponse, pendingResponse] = await Promise.all([
        decisionsApi.list(20, offset),
        offset === 0 ? decisionsApi.getPendingFeedback() : Promise.resolve([]),
      ]);

      if (offset === 0) {
        setDecisions(listResponse.decisions);
        setPendingFeedback(pendingResponse);
      } else {
        setDecisions((prev) => [...prev, ...listResponse.decisions]);
      }
      setHasMore(listResponse.hasMore);
    } catch (err) {
      setError('결정 목록을 불러오는데 실패했습니다.');
      console.error('Failed to load decisions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDecisions();
  }, []);

  const filteredDecisions = decisions.filter((d) => {
    switch (filter) {
      case 'pending':
        return isPendingFeedback(d);
      case 'completed':
        return d.feedback !== undefined;
      default:
        return true;
    }
  });

  if (isLoading && decisions.length === 0) {
    return <SkeletonList count={3} />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<span className="text-4xl">⚠️</span>}
        title="오류가 발생했습니다"
        description={error}
        action={
          <Button onClick={() => loadDecisions()} variant="outline">
            다시 시도
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 피드백 대기 알림 */}
      {pendingFeedback.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-amber-800 dark:text-amber-200">
            ⏰ 피드백이 필요한 결정이 {pendingFeedback.length}개 있어요
          </p>
        </div>
      )}

      {/* 필터 */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              filter === f
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            {f === 'all' && '전체'}
            {f === 'pending' && '피드백 대기'}
            {f === 'completed' && '피드백 완료'}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {filteredDecisions.length === 0 ? (
        <EmptyState
          icon={<span className="text-5xl">🎯</span>}
          title={filter === 'all' ? '아직 결정이 없어요' : '해당하는 결정이 없어요'}
          description={filter === 'all' ? '새로운 결정을 분석해보세요' : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filteredDecisions.map((decision) => (
            <DecisionCard key={decision.id} decision={decision} />
          ))}
        </div>
      )}

      {/* 더 보기 */}
      {hasMore && filter === 'all' && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => loadDecisions(decisions.length)}
            isLoading={isLoading}
          >
            더 보기
          </Button>
        </div>
      )}
    </div>
  );
}
