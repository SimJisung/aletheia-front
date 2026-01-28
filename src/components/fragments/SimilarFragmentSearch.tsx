'use client';

import { useState } from 'react';
import { Input, Button, EmptyState, SkeletonList } from '@/components/ui';
import { FragmentCard } from './FragmentCard';
import { fragmentsApi } from '@/lib/api';
import type { SimilarFragmentResult } from '@/types';

export function SimilarFragmentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SimilarFragmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await fragmentsApi.findSimilar(query.trim(), 10);
      setResults(data);
    } catch (err) {
      setError('검색에 실패했습니다. 다시 시도해주세요.');
      console.error('Failed to search:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요 (예: 커리어 성장, 관계 고민)"
          />
        </div>
        <Button type="submit" isLoading={isLoading}>
          검색
        </Button>
      </form>

      {/* 안내 문구 */}
      {!hasSearched && (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <p className="text-lg mb-2">🔍</p>
          <p>AI가 의미적으로 유사한 기록을 찾아줍니다</p>
        </div>
      )}

      {/* 로딩 */}
      {isLoading && <SkeletonList count={3} />}

      {/* 에러 */}
      {error && (
        <EmptyState
          icon={<span className="text-4xl">⚠️</span>}
          title="검색 실패"
          description={error}
        />
      )}

      {/* 결과 */}
      {!isLoading && hasSearched && results.length === 0 && (
        <EmptyState
          icon={<span className="text-4xl">🔎</span>}
          title="결과를 찾지 못했어요"
          description="다른 키워드로 검색하거나 새로운 생각을 기록해보세요"
        />
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {results.length}개의 유사한 기록을 찾았어요
          </p>
          {results.map((result) => (
            <FragmentCard
              key={result.fragment.id}
              fragment={result.fragment}
              similarity={result.similarity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
