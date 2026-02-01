'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, Badge, Button, EmptyState, Skeleton } from '@/components/ui';
import { valuesApi } from '@/lib/api';
import { formatValence } from '@/lib/utils';
import { MESSAGES } from '@/lib/constants/messages';
import { VALUE_AXIS_META, trendToIcon, ALL_VALUE_AXES, type ValueNode, type ValueEdge, type ValueAxis } from '@/types';
import { cn } from '@/lib/utils';

export default function ValueAxisDetailPage() {
  const params = useParams();
  const axisRaw = typeof params.axis === 'string' ? params.axis : '';
  const axisParam = axisRaw.toUpperCase() as ValueAxis;

  const [node, setNode] = useState<ValueNode | null>(null);
  const [edges, setEdges] = useState<ValueEdge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = VALUE_AXIS_META[axisParam];

  useEffect(() => {
    if (!ALL_VALUE_AXES.includes(axisParam)) {
      setError(MESSAGES.errors.invalidAxis);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [nodeData, edgesData] = await Promise.all([
          valuesApi.getAxis(axisParam, controller.signal),
          valuesApi.getEdges(controller.signal),
        ]);
        setNode(nodeData);
        // 현재 축과 관련된 엣지만 필터링
        setEdges(
          edgesData.filter(
            (e) => e.fromAxis === axisParam || e.toAxis === axisParam
          )
        );
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(MESSAGES.errors.loadValue);
        console.error('Failed to load value axis:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, [axisParam]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !node || !meta) {
    return (
      <EmptyState
        icon={<span className="text-4xl">⚠️</span>}
        title="가치를 찾을 수 없어요"
        description={error || '존재하지 않는 가치축입니다.'}
        action={
          <Link href="/values">
            <Button variant="outline">가치 지도로 돌아가기</Button>
          </Link>
        }
      />
    );
  }

  const supportEdges = edges.filter((e) => e.edgeType === 'SUPPORT');
  const conflictEdges = edges.filter((e) => e.edgeType === 'CONFLICT');

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link
        href="/values"
        className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        ← 가치 지도로
      </Link>

      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <span className="text-5xl">{meta.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {meta.displayNameKo}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            {meta.description}
          </p>
        </div>
      </div>

      {/* 현재 상태 */}
      <Card variant="default" padding="md">
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            현재 상태
          </h3>

          {/* 감정 척도 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">평균 감정</span>
              <span
                className={cn(
                  'font-semibold',
                  node.avgValence >= 0 ? 'text-success-600' : 'text-amber-600'
                )}
              >
                {formatValence(node.avgValence)}
              </span>
            </div>
            <div className="relative h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 left-1/2 w-1 bg-neutral-400"
              />
              <div
                className={cn(
                  'absolute top-0 bottom-0 rounded-full transition-all',
                  node.avgValence >= 0 ? 'bg-success-500' : 'bg-amber-500'
                )}
                style={{
                  left: node.avgValence >= 0 ? '50%' : `${50 + node.avgValence * 50}%`,
                  width: `${Math.abs(node.avgValence) * 50}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-400">
              <span>-1.0</span>
              <span>0</span>
              <span>+1.0</span>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <div>
              <p className="text-sm text-neutral-500">최근 트렌드</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                {trendToIcon(node.recentTrend)}
                {node.recentTrend === 'RISING' ? '상승 중' : node.recentTrend === 'FALLING' ? '하락 중' : '안정'}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">관련 기록</p>
              <p className="text-lg font-semibold">
                {Math.round(node.fragmentCount)}개
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 관계된 가치들 */}
      <Card variant="default" padding="md">
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            관계된 가치들
          </h3>

          {/* 지지 관계 */}
          {supportEdges.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-success-600 flex items-center gap-1">
                💪 지지 관계
              </p>
              {supportEdges.map((edge, index) => {
                const otherAxis = edge.fromAxis === axisParam ? edge.toAxis : edge.fromAxis;
                const otherMeta = VALUE_AXIS_META[otherAxis];
                return (
                  <Link
                    key={index}
                    href={`/values/${otherAxis.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-success-50 dark:bg-success-900/20 hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{otherMeta.icon}</span>
                      <span className="font-medium">{otherMeta.displayNameKo}</span>
                    </div>
                    <Badge variant="success" size="sm">
                      {(edge.weight * 100).toFixed(0)}%
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}

          {/* 긴장 관계 */}
          {conflictEdges.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-600 flex items-center gap-1">
                ⚡ 긴장 관계
              </p>
              {conflictEdges.map((edge, index) => {
                const otherAxis = edge.fromAxis === axisParam ? edge.toAxis : edge.fromAxis;
                const otherMeta = VALUE_AXIS_META[otherAxis];
                return (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{otherMeta.icon}</span>
                        <span className="font-medium">{otherMeta.displayNameKo}</span>
                      </div>
                      <Badge variant="warning" size="sm">
                        {(edge.weight * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                      이것은 자연스러운 현상입니다. 많은 사람들이 비슷한 긴장을 경험합니다.
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {supportEdges.length === 0 && conflictEdges.length === 0 && (
            <p className="text-neutral-500 text-sm">
              아직 발견된 관계가 없습니다. 더 많은 생각을 기록해보세요.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
