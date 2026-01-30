'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, Badge, Button, Modal, EmptyState, Skeleton, SafeText } from '@/components/ui';
import { FragmentCard } from '@/components/fragments';
import { fragmentsApi } from '@/lib/api';
import { formatDateTime, formatValence } from '@/lib/utils';
import { valenceToEmoji, type ThoughtFragment, type SimilarFragmentResult } from '@/types';

export default function FragmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [fragment, setFragment] = useState<ThoughtFragment | null>(null);
  const [similarFragments, setSimilarFragments] = useState<SimilarFragmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFragment = async () => {
      try {
        setIsLoading(true);
        const data = await fragmentsApi.getById(id);
        setFragment(data);

        // 유사 기록 로드
        const similar = await fragmentsApi.findSimilar(data.text, 5);
        // 자기 자신 제외
        setSimilarFragments(similar.filter((s) => s.fragment.id !== id));
      } catch (err) {
        setError('기록을 불러오는데 실패했습니다.');
        console.error('Failed to load fragment:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFragment();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await fragmentsApi.delete(id);
      router.push('/fragments');
    } catch (err) {
      console.error('Failed to delete fragment:', err);
      setError('삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card variant="bordered" padding="lg">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !fragment) {
    return (
      <EmptyState
        icon={<span className="text-4xl">⚠️</span>}
        title="기록을 찾을 수 없어요"
        description={error || '존재하지 않거나 삭제된 기록입니다.'}
        action={
          <Link href="/fragments">
            <Button variant="outline">목록으로 돌아가기</Button>
          </Link>
        }
      />
    );
  }

  const emoji = valenceToEmoji(fragment.moodValence);

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/fragments"
        className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        ← 목록으로
      </Link>

      {/* 기록 상세 */}
      <Card variant="bordered" padding="lg">
        <CardContent className="space-y-6">
          {/* 날짜 */}
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatDateTime(fragment.createdAt)}
          </p>

          {/* 본문 */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
            <SafeText className="text-lg text-neutral-900 dark:text-neutral-100">
              {fragment.text}
            </SafeText>
          </div>

          {/* 감정 분석 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              감정 분석
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-sm text-neutral-500">기분</p>
                  <p className="font-medium">
                    {fragment.moodValence >= 0 ? '긍정적' : '부정적'} ({formatValence(fragment.moodValence)})
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-500">각성도</p>
                <p className="font-medium">
                  {fragment.arousal >= 0.5 ? '⚡ 활발함' : '🍃 차분함'} ({fragment.arousal.toFixed(1)})
                </p>
              </div>
              {fragment.topicHint && (
                <div>
                  <p className="text-sm text-neutral-500">주제</p>
                  <Badge variant="outline">#{fragment.topicHint}</Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 유사한 기록 */}
      {similarFragments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            비슷한 과거 기록
          </h2>
          <div className="space-y-3">
            {similarFragments.map((result) => (
              <FragmentCard
                key={result.fragment.id}
                fragment={result.fragment}
                similarity={result.similarity}
              />
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex justify-end">
        <Button variant="ghost" onClick={() => setShowDeleteModal(true)}>
          🗑️ 숨기기
        </Button>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="기록 숨기기"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            이 기록을 숨길까요?
          </p>
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
            <SafeText className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
              {`"${fragment.text}"`}
            </SafeText>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            ⚠️ 숨긴 기록은 목록에서 보이지 않지만, 가치 분석에는 영향을 주지 않습니다.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              숨기기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
