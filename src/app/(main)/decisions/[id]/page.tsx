'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import { DecisionResultView } from '@/components/decisions';
import { decisionsApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { isValidUuid } from '@/lib/utils/params';
import { MESSAGES } from '@/lib/constants/messages';
import type { Decision } from '@/types';

export default function DecisionDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const abortControllerRef = useRef<AbortController | null>(null);

  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDecision = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await decisionsApi.getById(id, { signal });
      setDecision(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(MESSAGES.errors.loadDecision);
      console.error('Failed to load decision:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isValidUuid(id)) {
      setError(MESSAGES.errors.invalidId);
      setIsLoading(false);
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    loadDecision(abortControllerRef.current.signal);

    return () => abortControllerRef.current?.abort();
  }, [id, loadDecision]);

  const handleFeedbackSubmitted = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    loadDecision(abortControllerRef.current.signal);
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
