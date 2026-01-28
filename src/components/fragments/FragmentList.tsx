'use client';

import { useState, useEffect } from 'react';
import { FragmentCard } from './FragmentCard';
import { Button, EmptyState, SkeletonList } from '@/components/ui';
import { fragmentsApi } from '@/lib/api';
import type { ThoughtFragment } from '@/types';

interface FragmentListProps {
  initialFragments?: ThoughtFragment[];
  limit?: number;
}

export function FragmentList({ initialFragments, limit = 20 }: FragmentListProps) {
  const [fragments, setFragments] = useState<ThoughtFragment[]>(initialFragments || []);
  const [isLoading, setIsLoading] = useState(!initialFragments);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFragments = async (offset = 0) => {
    try {
      setIsLoading(true);
      const response = await fragmentsApi.list(limit, offset);

      if (offset === 0) {
        setFragments(response.fragments);
      } else {
        setFragments((prev) => [...prev, ...response.fragments]);
      }
      setHasMore(response.hasMore);
    } catch (err) {
      setError('기록을 불러오는데 실패했습니다.');
      console.error('Failed to load fragments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialFragments) {
      loadFragments();
    }
  }, [initialFragments]);

  const handleLoadMore = () => {
    loadFragments(fragments.length);
  };

  if (isLoading && fragments.length === 0) {
    return <SkeletonList count={3} />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<span className="text-4xl">⚠️</span>}
        title="오류가 발생했습니다"
        description={error}
        action={
          <Button onClick={() => loadFragments()} variant="outline">
            다시 시도
          </Button>
        }
      />
    );
  }

  if (fragments.length === 0) {
    return (
      <EmptyState
        icon={<span className="text-5xl">🌱</span>}
        title="아직 기록이 없어요"
        description="첫 생각을 기록하면 당신만의 가치 그래프가 형성되기 시작해요"
      />
    );
  }

  return (
    <div className="space-y-4">
      {fragments.map((fragment) => (
        <FragmentCard key={fragment.id} fragment={fragment} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            isLoading={isLoading}
          >
            더 보기
          </Button>
        </div>
      )}
    </div>
  );
}
