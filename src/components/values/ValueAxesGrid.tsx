'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { VALUE_AXIS_META, trendToIcon, type ValueNode } from '@/types';
import { cn } from '@/lib/utils';

interface ValueAxesGridProps {
  nodes: ValueNode[];
}

export function ValueAxesGrid({ nodes }: ValueAxesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {nodes.map((node) => {
        const meta = VALUE_AXIS_META[node.axis];
        const isPositive = node.avgValence >= 0;

        return (
          <Link key={node.axis} href={`/values/${node.axis.toLowerCase()}`}>
            <Card
              variant="default"
              padding="sm"
              className="hover:border-primary-300 dark:hover:border-primary-600 transition-colors h-full"
            >
              <CardContent className="text-center space-y-2">
                <span className="text-3xl">{meta.icon}</span>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                  {meta.displayNameKo}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={cn(
                      'font-semibold',
                      isPositive ? 'text-success-600' : 'text-amber-600'
                    )}
                  >
                    {isPositive ? '+' : ''}{node.avgValence.toFixed(1)}
                  </span>
                  <span>{trendToIcon(node.recentTrend)}</span>
                </div>
                <p className="text-xs text-neutral-500">
                  {Math.round(node.fragmentCount)}개 기록
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
