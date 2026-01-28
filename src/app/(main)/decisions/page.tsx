'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { DecisionList } from '@/components/decisions';

export default function DecisionsPage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            🎯 나의 결정들
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            과거 패턴을 기반으로 의사결정을 분석합니다
          </p>
        </div>
        <Link href="/decisions/new">
          <Button>+ 새 결정</Button>
        </Link>
      </div>

      {/* 결정 목록 */}
      <DecisionList />
    </div>
  );
}
