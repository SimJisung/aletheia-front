'use client';

import Link from 'next/link';
import { DecisionInputForm } from '@/components/decisions';

export default function NewDecisionPage() {
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
          🎯 새로운 결정 분석
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          두 가지 선택지를 입력하면 과거 패턴을 기반으로 분석해드립니다
        </p>
      </div>

      {/* 입력 폼 */}
      <DecisionInputForm />
    </div>
  );
}
