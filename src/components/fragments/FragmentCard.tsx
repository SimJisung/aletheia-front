'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Hash } from 'lucide-react';
import { Card, Badge, SafeText } from '@/components/ui';
import { MoodIcon, type MoodLevel } from '@/components/brand';
import { formatRelativeTime } from '@/lib/utils';
import { type ThoughtFragment } from '@/types';
import { cn } from '@/lib/utils';

interface FragmentCardProps {
  fragment: ThoughtFragment;
  showLink?: boolean;
  similarity?: number;
}

// Map valence to MoodLevel
function valenceToMoodLevel(valence: number): MoodLevel {
  if (valence >= 0.6) return 'very-positive';
  if (valence >= 0.2) return 'positive';
  if (valence >= -0.2) return 'neutral';
  if (valence >= -0.6) return 'negative';
  return 'very-negative';
}

export function FragmentCard({ fragment, showLink = true, similarity }: FragmentCardProps) {
  const moodLevel = valenceToMoodLevel(fragment.moodValence);

  const content = (
    <Card
      variant="interactive"
      padding="md"
      className="group"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Clock className="w-4 h-4" />
            <span>{formatRelativeTime(fragment.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            {similarity !== undefined && (
              <Badge variant="secondary" size="sm" glow>
                {Math.round(similarity * 100)}% match
              </Badge>
            )}
            <MoodIcon mood={moodLevel} size="sm" />
          </div>
        </div>

        {/* Content */}
        <SafeText
          className={cn(
            'text-neutral-900 dark:text-neutral-100',
            'line-clamp-3 leading-relaxed'
          )}
        >
          {fragment.text}
        </SafeText>

        {/* Topic tag */}
        {fragment.topicHint && (
          <div className="flex items-center gap-1">
            <Badge variant="outline" size="sm">
              <Hash className="w-3 h-3" />
              {fragment.topicHint}
            </Badge>
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <motion.div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-0.5',
          'bg-gradient-to-r from-primary-500 to-secondary-500',
          'origin-left'
        )}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </Card>
  );

  if (showLink) {
    return (
      <Link href={`/fragments/${fragment.id}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
