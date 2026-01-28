'use client';

import { useState } from 'react';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { FeedbackButtons } from './FeedbackButtons';
import { decisionsApi } from '@/lib/api';
import { formatPercent } from '@/lib/utils';
import { VALUE_AXIS_META, type Decision, type ValueAxis } from '@/types';
import { cn } from '@/lib/utils';

interface DecisionResultViewProps {
  decision: Decision;
  onFeedbackSubmitted?: () => void;
}

export function DecisionResultView({ decision, onFeedbackSubmitted }: DecisionResultViewProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const { result } = decision;

  const loadExplanation = async () => {
    if (explanation) return;

    setIsLoadingExplanation(true);
    try {
      const data = await decisionsApi.getExplanation(decision.id);
      setExplanation(data.explanation);
    } catch (err) {
      console.error('Failed to load explanation:', err);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // 가치 정렬 정렬 (높은 순)
  const sortedAlignment = Object.entries(result.valueAlignment)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 경고 배너 */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-200">
              이것은 추천이 아닙니다
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              과거 당신의 패턴을 기반으로 한 적합도 분석입니다. 최종 결정은 당신의 몫입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 옵션 비교 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option A */}
        <Card variant="bordered" padding="md">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="primary">선택지 A</Badge>
            </div>
            <p className="text-neutral-900 dark:text-neutral-100 font-medium">
              {decision.optionA}
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-neutral-500">패턴 적합도</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatPercent(result.probabilityA)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">후회 위험</p>
                <p className={cn(
                  'text-lg font-semibold',
                  result.regretRiskA > 0.3 ? 'text-amber-600' : 'text-success-600'
                )}>
                  {formatPercent(result.regretRiskA)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option B */}
        <Card variant="bordered" padding="md">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">선택지 B</Badge>
            </div>
            <p className="text-neutral-900 dark:text-neutral-100 font-medium">
              {decision.optionB}
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-neutral-500">패턴 적합도</p>
                <p className="text-2xl font-bold text-secondary-600">
                  {formatPercent(result.probabilityB)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">후회 위험</p>
                <p className={cn(
                  'text-lg font-semibold',
                  result.regretRiskB > 0.3 ? 'text-amber-600' : 'text-success-600'
                )}>
                  {formatPercent(result.regretRiskB)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 가치 정렬 */}
      <Card variant="bordered" padding="md">
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            📊 가치 정렬
          </h3>
          <div className="space-y-3">
            {sortedAlignment.map(([axis, value]) => {
              const meta = VALUE_AXIS_META[axis as ValueAxis];
              return (
                <div key={axis} className="flex items-center gap-3">
                  <span className="w-6">{meta.icon}</span>
                  <span className="w-24 text-sm text-neutral-600 dark:text-neutral-300">
                    {meta.displayNameKo}
                  </span>
                  <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.max(value * 100, 5)}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-neutral-500 text-right">
                    {value.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 설명 */}
      <Card variant="bordered" padding="md">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              📝 분석 설명
            </h3>
            {!explanation && (
              <Button
                variant="outline"
                size="sm"
                onClick={loadExplanation}
                isLoading={isLoadingExplanation}
              >
                설명 보기
              </Button>
            )}
          </div>
          {explanation ? (
            <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
              {explanation}
            </p>
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              AI가 생성한 상세 설명을 확인하려면 "설명 보기"를 클릭하세요.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 피드백 */}
      {!decision.feedback && (
        <Card variant="bordered" padding="md">
          <CardContent>
            <FeedbackButtons
              decisionId={decision.id}
              onSuccess={onFeedbackSubmitted}
            />
          </CardContent>
        </Card>
      )}

      {decision.feedback && (
        <div className="text-center text-neutral-500 dark:text-neutral-400">
          피드백 완료: {decision.feedback.feedbackType === 'SATISFIED' ? '😊 만족' : decision.feedback.feedbackType === 'NEUTRAL' ? '😐 보통' : '😔 아쉬움'}
        </div>
      )}
    </div>
  );
}
