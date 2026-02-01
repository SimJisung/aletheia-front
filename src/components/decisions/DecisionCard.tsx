'use client';

import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import { VALUE_AXIS_META, isPendingFeedback, type Decision, type ValueAxis } from '@/types';

interface DecisionCardProps {
  decision: Decision;
}

export function DecisionCard({ decision }: DecisionCardProps) {
  const needsFeedback = isPendingFeedback(decision);
  const priorityAxisKey = decision.priorityAxis as ValueAxis | undefined;
  const priorityMeta = priorityAxisKey ? VALUE_AXIS_META[priorityAxisKey] : null;

  return (
    <Link href={`/decisions/${decision.id}`}>
      <Card
        variant="default"
        padding="md"
        className="hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
      >
        <div className="space-y-3">
          {/* 헤더 */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {needsFeedback && (
                <Badge variant="warning" size="sm" className="mb-2">
                  ⏰ 피드백 대기
                </Badge>
              )}
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {decision.title}
              </h3>
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{formatRelativeTime(decision.createdAt)}</span>
            {priorityMeta && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {priorityMeta.icon} {priorityMeta.displayNameKo}
                </span>
              </>
            )}
          </div>

          {/* 결과 요약 */}
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-neutral-500">A: </span>
              <span className="font-medium text-primary-600">
                {decision.result.probabilityA}%
              </span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-600">vs</span>
            <div>
              <span className="text-neutral-500">B: </span>
              <span className="font-medium text-secondary-600">
                {decision.result.probabilityB}%
              </span>
            </div>
          </div>

          {/* 피드백 상태 */}
          {decision.feedback && (
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700">
              <span className="text-sm text-neutral-500">
                피드백: {decision.feedback.feedbackType === 'SATISFIED' ? '😊 만족' : decision.feedback.feedbackType === 'NEUTRAL' ? '😐 보통' : '😔 아쉬움'}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
