'use client';

import { useState } from 'react';
import { Card, CardContent, Badge, Button, SafeText } from '@/components/ui';
import { FeedbackButtons } from './FeedbackButtons';
import { decisionsApi } from '@/lib/api';
import { ApiError, TimeoutError } from '@/lib/api/client';
import { MESSAGES } from '@/lib/constants/messages';
import { VALUE_AXIS_META, type Decision, type DecisionExplanation, type ValueAxis } from '@/types';
import { cn } from '@/lib/utils';

interface DecisionResultViewProps {
  decision: Decision;
  onFeedbackSubmitted?: () => void;
}

export function DecisionResultView({ decision, onFeedbackSubmitted }: DecisionResultViewProps) {
  // decision에 explanation이 있으면 초기값으로 사용
  const [explanation, setExplanation] = useState<DecisionExplanation | null>(
    decision.explanation ?? null
  );
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  const { result } = decision;

  const loadExplanation = async () => {
    if (explanation) return;

    setIsLoadingExplanation(true);
    setExplanationError(null);
    try {
      const data = await decisionsApi.getExplanation(decision.id);
      setExplanation(data);
    } catch (err) {
      console.error('Failed to load explanation:', err);
      if (err instanceof TimeoutError) {
        setExplanationError(MESSAGES.errors.loadExplanationTimeout);
      } else if (err instanceof ApiError && err.status >= 500) {
        setExplanationError(MESSAGES.errors.loadExplanationServer);
      } else {
        setExplanationError(MESSAGES.errors.loadExplanation);
      }
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
        <Card variant="default" padding="md">
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
                  {result.probabilityA}%
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">후회 위험</p>
                <p className={cn(
                  'text-lg font-semibold',
                  result.regretRiskA > 30 ? 'text-amber-600' : 'text-success-600'
                )}>
                  {result.regretRiskA}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Option B */}
        <Card variant="default" padding="md">
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
                  {result.probabilityB}%
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">후회 위험</p>
                <p className={cn(
                  'text-lg font-semibold',
                  result.regretRiskB > 30 ? 'text-amber-600' : 'text-success-600'
                )}>
                  {result.regretRiskB}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 가치 정렬 */}
      <Card variant="default" padding="md">
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              📊 가치별 정렬 비교
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              각 가치에 대해 어느 선택지가 더 부합하는지 보여줍니다
            </p>
          </div>

          {/* 범례 */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-neutral-600 dark:text-neutral-300">A 쪽</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary-500" />
              <span className="text-neutral-600 dark:text-neutral-300">B 쪽</span>
            </div>
          </div>

          <div className="space-y-4">
            {sortedAlignment.map(([axis, value]) => {
              const meta = VALUE_AXIS_META[axis as ValueAxis];
              // value: 0.5 = 중립, >0.5 = A 쪽, <0.5 = B 쪽
              const deviation = value - 0.5; // -0.5 ~ +0.5
              const isNeutral = Math.abs(deviation) < 0.05;
              const favorsA = deviation > 0;
              const percentage = Math.abs(deviation) * 100; // 0 ~ 50

              return (
                <div key={axis} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{meta.icon}</span>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                        {meta.displayNameKo}
                      </span>
                    </div>
                    <span className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full',
                      isNeutral
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                        : favorsA
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300'
                    )}>
                      {isNeutral ? '중립' : favorsA ? `A +${(percentage * 2).toFixed(0)}%` : `B +${(percentage * 2).toFixed(0)}%`}
                    </span>
                  </div>

                  {/* 양방향 바 그래프 */}
                  <div className="flex items-center gap-1">
                    {/* B 쪽 바 (왼쪽) */}
                    <div className="flex-1 flex justify-end">
                      <div
                        className={cn(
                          'h-2 rounded-l-full transition-all',
                          !favorsA && !isNeutral ? 'bg-secondary-500' : 'bg-neutral-200 dark:bg-neutral-700'
                        )}
                        style={{ width: !favorsA ? `${percentage * 2}%` : '0%' }}
                      />
                    </div>

                    {/* 중앙선 */}
                    <div className="w-0.5 h-4 bg-neutral-300 dark:bg-neutral-600" />

                    {/* A 쪽 바 (오른쪽) */}
                    <div className="flex-1">
                      <div
                        className={cn(
                          'h-2 rounded-r-full transition-all',
                          favorsA && !isNeutral ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'
                        )}
                        style={{ width: favorsA ? `${percentage * 2}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 설명 */}
      <Card variant="default" padding="md">
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
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  요약
                </h4>
                <SafeText className="text-neutral-700 dark:text-neutral-300">
                  {explanation.summary}
                </SafeText>
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  근거 분석
                </h4>
                <SafeText className="text-neutral-700 dark:text-neutral-300">
                  {explanation.evidenceSummary}
                </SafeText>
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  가치 관점
                </h4>
                <SafeText className="text-neutral-700 dark:text-neutral-300">
                  {explanation.valueSummary}
                </SafeText>
              </div>
            </div>
          ) : isLoadingExplanation ? (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                <div>
                  <p className="text-blue-700 dark:text-blue-300 font-medium">
                    {MESSAGES.info.explanationGenerating}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                    {MESSAGES.info.explanationWait}
                  </p>
                </div>
              </div>
            </div>
          ) : explanationError ? (
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">
                {explanationError}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadExplanation}
                isLoading={isLoadingExplanation}
              >
                {MESSAGES.actions.retry}
              </Button>
            </div>
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              AI가 생성한 상세 설명을 확인하려면 &quot;설명 보기&quot;를 클릭하세요.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 피드백 */}
      {!decision.feedback && (
        <Card variant="default" padding="md">
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
