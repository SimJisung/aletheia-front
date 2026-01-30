'use client';

import Link from 'next/link';
import { Card, Badge, SafeText } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import { valenceToEmoji, type ThoughtFragment } from '@/types';

interface FragmentCardProps {
  fragment: ThoughtFragment;
  showLink?: boolean;
  similarity?: number;
}

export function FragmentCard({ fragment, showLink = true, similarity }: FragmentCardProps) {
  const emoji = valenceToEmoji(fragment.moodValence);

  const content = (
    <Card
      variant="bordered"
      padding="md"
      className="hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-pointer"
    >
      <div className="space-y-3">
        {/* 헤더 */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">
            {formatRelativeTime(fragment.createdAt)}
          </span>
          <div className="flex items-center gap-2">
            {similarity !== undefined && (
              <Badge variant="secondary" size="sm">
                유사도 {Math.round(similarity * 100)}%
              </Badge>
            )}
            <span className="text-lg">{emoji}</span>
          </div>
        </div>

        {/* 본문 */}
        <SafeText className="text-neutral-900 dark:text-neutral-100 line-clamp-3">
          {fragment.text}
        </SafeText>

        {/* 주제 태그 */}
        {fragment.topicHint && (
          <div>
            <Badge variant="outline" size="sm">
              #{fragment.topicHint}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );

  if (showLink) {
    return <Link href={`/fragments/${fragment.id}`}>{content}</Link>;
  }

  return content;
}
