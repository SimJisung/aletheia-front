'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import { DecisionResultView } from '@/components/decisions';
import { decisionsApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import type { Decision } from '@/types';

export default function DecisionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDecision = async () => {
    try {
      setIsLoading(true);
      const data = await decisionsApi.getById(id);
      setDecision(data);
    } catch (err) {
      setError('결정을 불러오는데 실패했습니다.');
      console.error('Failed to load decision:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDecision();
  }, [id]);

  const handleFeedbackSubmitted = () => {
    loadDecision();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !decision) {
    return (
      <EmptyState
        icon={<span className="text-4xl">⚠️</span>}
        title="결정을 찾을 수 없어요"
        description={error || '존재하지 않는 결정입니다.'}
        action={
          <Link href="/decisions">
            <Button variant="outline">목록으로 돌아가기</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/decisions"
        className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        ← 목록으로
      </Link>

      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {decision.title}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          {formatDateTime(decision.createdAt)}
        </p>
      </div>

      {/* 결과 뷰 */}
      <DecisionResultView
        decision={decision}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </div>
  );
}
