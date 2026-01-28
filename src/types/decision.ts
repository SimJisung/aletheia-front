/**
 * Decision 타입 정의
 * aletheia-core의 Decision 도메인 모델과 매핑
 */

import { ValueAxis } from './value';

export interface DecisionResult {
  probabilityA: number; // 0.0 ~ 1.0
  probabilityB: number; // 0.0 ~ 1.0
  regretRiskA: number; // 0.0 ~ 1.0
  regretRiskB: number; // 0.0 ~ 1.0
  evidenceFragmentIds: string[];
  valueAlignment: Record<ValueAxis, number>;
}

export interface Decision {
  id: string;
  userId: string;
  title: string;
  optionA: string;
  optionB: string;
  priorityAxis?: ValueAxis;
  result: DecisionResult;
  createdAt: string;
  feedback?: DecisionFeedback;
}

export interface CreateDecisionRequest {
  title: string;
  optionA: string;
  optionB: string;
  priorityAxis?: ValueAxis;
}

export interface DecisionListResponse {
  decisions: Decision[];
  total: number;
  hasMore: boolean;
}

export interface DecisionExplanation {
  decisionId: string;
  explanation: string;
  generatedAt: string;
}

// 피드백 타입
export type FeedbackType = 'SATISFIED' | 'NEUTRAL' | 'REGRET';

export interface DecisionFeedback {
  id: string;
  decisionId: string;
  feedbackType: FeedbackType;
  createdAt: string;
}

export interface SubmitFeedbackRequest {
  feedbackType: FeedbackType;
}

// 피드백 옵션 정의 (UI용)
export interface FeedbackOption {
  type: FeedbackType;
  emoji: string;
  label: string;
  description: string;
}

export const FEEDBACK_OPTIONS: FeedbackOption[] = [
  {
    type: 'SATISFIED',
    emoji: '😊',
    label: '만족',
    description: '좋은 선택이었어요',
  },
  {
    type: 'NEUTRAL',
    emoji: '😐',
    label: '보통',
    description: '그냥 그랬어요',
  },
  {
    type: 'REGRET',
    emoji: '😔',
    label: '아쉬움',
    description: '다르게 했으면 좋았을 것 같아요',
  },
];

// 결정이 피드백 대기 상태인지 확인 (24-72시간)
export function isPendingFeedback(decision: Decision): boolean {
  if (decision.feedback) return false;

  const createdAt = new Date(decision.createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  return hoursDiff >= 24 && hoursDiff <= 72;
}

// 확률을 퍼센트 문자열로 변환
export function probabilityToPercent(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}
