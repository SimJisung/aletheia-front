'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { FragmentInputForm, FragmentList, SimilarFragmentSearch } from '@/components/fragments';
import { cn } from '@/lib/utils';

type TabType = 'list' | 'search';

export default function FragmentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFragmentCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            📝 나의 기록
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            생각과 감정을 기록하고 돌아보세요
          </p>
        </div>
      </div>

      {/* 입력 폼 */}
      <FragmentInputForm onSuccess={handleFragmentCreated} />

      {/* 탭 */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setActiveTab('list')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'list'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          )}
        >
          전체 기록
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'search'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          )}
        >
          🔍 유사 기록 검색
        </button>
      </div>

      {/* 컨텐츠 */}
      {activeTab === 'list' ? (
        <FragmentList key={refreshKey} />
      ) : (
        <SimilarFragmentSearch />
      )}
    </div>
  );
}
