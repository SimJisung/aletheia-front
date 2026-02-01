'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Button, Textarea } from '@/components/ui';
import { MoodSelector } from '@/components/fragments';
import { useUserStore } from '@/stores';
import { fragmentsApi } from '@/lib/api';
import { ALL_VALUE_AXES, VALUE_AXIS_META, type ValueAxis, type MoodLevel } from '@/types';
import { cn } from '@/lib/utils';

type Step = 'welcome' | 'first-thought' | 'values' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboardingStep, onboarding } = useUserStore();

  const [currentStep, setCurrentStep] = useState<Step>(onboarding.currentStep);
  const [thoughtText, setThoughtText] = useState('');
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [selectedValues, setSelectedValues] = useState<ValueAxis[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const handleWelcomeNext = () => {
    completeOnboardingStep('welcome');
    goToStep('first-thought');
  };

  const handleThoughtNext = async () => {
    if (!thoughtText.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await fragmentsApi.create({
        text: thoughtText.trim(),
      });
      completeOnboardingStep('first-thought');
      goToStep('values');
    } catch (err) {
      console.error('Failed to create first fragment:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(`생각을 저장하는 중 문제가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValuesNext = () => {
    completeOnboardingStep('values');
    goToStep('complete');
  };

  const handleComplete = () => {
    completeOnboardingStep('complete');
    router.push('/dashboard');
  };

  const toggleValue = (axis: ValueAxis) => {
    setSelectedValues((prev) =>
      prev.includes(axis)
        ? prev.filter((v) => v !== axis)
        : [...prev, axis]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Step 1: Welcome */}
        {currentStep === 'welcome' && (
          <Card variant="elevated" padding="lg" className="animate-in">
            <CardContent className="text-center space-y-6">
              <div className="text-6xl">💡</div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  PROS에 오신 것을 환영합니다
                </h1>
                <p className="text-lg text-primary-600 dark:text-primary-400 mt-2">
                  Personal Reasoning OS
                </p>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300">
                PROS는 AI가 결정하는 것이 아닌,
                <br />
                <strong>과거의 나를 불러오는</strong> 개인 시스템입니다.
              </p>
              <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4 text-left">
                <p className="text-sm text-primary-800 dark:text-primary-200">
                  ✨ 생각을 기록하면 당신만의 가치 그래프가 형성됩니다
                  <br />
                  ✨ 의사결정 시 과거 패턴을 기반으로 분석해드립니다
                  <br />
                  ✨ 추천이 아닌 정보를 제공합니다
                </p>
              </div>
              <Button onClick={handleWelcomeNext} size="lg" className="w-full">
                시작하기
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: First Thought */}
        {currentStep === 'first-thought' && (
          <Card variant="elevated" padding="lg" className="animate-in">
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📝</div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  첫 번째 생각을 기록해보세요
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                  지금 떠오르는 생각을 자유롭게 적어주세요
                </p>
              </div>

              <Textarea
                value={thoughtText}
                onChange={(e) => setThoughtText(e.target.value)}
                placeholder="요즘 새로운 도전을 해보고 싶은데..."
                rows={4}
              />

              <div className="space-y-3">
                <p className="text-sm text-neutral-500">오늘 기분은 어떠신가요? (선택)</p>
                <MoodSelector value={mood} onChange={setMood} size="md" />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 첫 기록이 완료되면, 당신만의 가치 그래프가 형성되기 시작합니다.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-sm text-red-600 dark:text-red-400 underline mt-1 hover:no-underline"
                  >
                    다시 시도하기
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => goToStep('welcome')}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button
                  onClick={handleThoughtNext}
                  disabled={!thoughtText.trim()}
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  기록하기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Values */}
        {currentStep === 'values' && (
          <Card variant="elevated" padding="lg" className="animate-in">
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">💎</div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  당신에게 중요한 가치는?
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                  선택하지 않아도 괜찮아요. 기록을 통해 자동으로 파악됩니다.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {ALL_VALUE_AXES.map((axis) => {
                  const meta = VALUE_AXIS_META[axis];
                  const isSelected = selectedValues.includes(axis);
                  return (
                    <button
                      key={axis}
                      onClick={() => toggleValue(axis)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left',
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                      )}
                    >
                      <span className="text-xl">{meta.icon}</span>
                      <span className="font-medium text-sm">{meta.displayNameKo}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => goToStep('first-thought')}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button onClick={handleValuesNext} className="flex-1">
                  {selectedValues.length > 0 ? '선택 완료' : '건너뛰기'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Complete */}
        {currentStep === 'complete' && (
          <Card variant="elevated" padding="lg" className="animate-in">
            <CardContent className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  준비가 완료되었습니다!
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                  이제 PROS와 함께 여정을 시작해보세요
                </p>
              </div>

              <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm text-success-700 dark:text-success-300">
                  ✅ 첫 번째 생각이 기록되었어요
                </p>
                <p className="text-sm text-success-700 dark:text-success-300">
                  ✅ 가치 그래프가 형성되기 시작했어요
                </p>
                <p className="text-sm text-success-700 dark:text-success-300">
                  ✅ 의사결정 분석 준비 완료
                </p>
              </div>

              <Button onClick={handleComplete} size="lg" className="w-full">
                대시보드로 이동 →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 진행 표시 */}
        <div className="flex justify-center gap-2 mt-6">
          {(['welcome', 'first-thought', 'values', 'complete'] as Step[]).map((step, index) => (
            <div
              key={step}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                currentStep === step
                  ? 'bg-primary-600'
                  : index < ['welcome', 'first-thought', 'values', 'complete'].indexOf(currentStep)
                  ? 'bg-primary-300'
                  : 'bg-neutral-300 dark:bg-neutral-600'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
