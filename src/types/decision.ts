/**
 * Decision 타입 정의
 * aletheia-core의 Decision 도메인 모델과 매핑
 */

export interface DecisionResult {
  probabilityA: number; // 0 ~ 100 (percentage)
  probabilityB: number; // 0 ~ 100 (percentage)
  regretRiskA: number; // 0 ~ 100 (percentage)
  regretRiskB: number; // 0 ~ 100 (percentage)
  evidenceFragmentIds: string[];
  valueAlignment: Record<string, number>; // axis name (e.g., "GROWTH") -> score
}

export interface Decision {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  priorityAxis?: string; // ValueAxis name (e.g., "GROWTH")
  result: DecisionResult;
  createdAt: string;
  feedback?: DecisionFeedback;
  explanation?: DecisionExplanation;
  breakdown?: CalculationBreakdown; // detail=true 시 포함
}

export interface CreateDecisionRequest {
  title: string;
  optionA: string;
  optionB: string;
  priorityAxis?: string; // ValueAxis name
}

export interface DecisionListResponse {
  decisions: Decision[];
  total: number;
  hasMore: boolean;
}

export interface DecisionExplanation {
  decisionId: string;
  summary: string;
  evidenceSummary: string;
  valueSummary: string;
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

// ============================================
// Feedback Impact (피드백 제출 후 반환되는 영향도 정보)
// ============================================

export interface FeedbackResponse {
  id: string;
  decisionId: string;
  feedbackType: FeedbackType;
  createdAt: string;
  impact: FeedbackImpact;
}

export interface FeedbackImpact {
  stats: FeedbackStats;
  parameterUpdate: ParameterUpdate | null;
  effectDescription: string;
}

export interface FeedbackStats {
  totalDecisions: number;
  totalWithFeedback: number;
  satisfiedCount: number;
  neutralCount: number;
  regretCount: number;
  regretRate: number; // 0.0 ~ 1.0
}

export interface ParameterUpdate {
  lambdaBefore: number;
  lambdaAfter: number;
  regretPriorBefore: number;
  regretPriorAfter: number;
  reason: string;
}

// ============================================
// Calculation Breakdown (detail=true 시 반환되는 계산 상세)
// ============================================

export interface CalculationBreakdown {
  fit: FitBreakdown;
  regret: RegretBreakdown;
  parameters: CalculationParameters;
  scores: ScoreBreakdown;
}

export interface FitBreakdown {
  fitScoreA: number;
  fitScoreB: number;
  totalWeight: number;
  priorityAxisBoost: number;
  isOptionAMoreFit: boolean;
  fitDifference: number;
  fragmentContributions: FragmentContribution[];
}

export interface FragmentContribution {
  fragmentId: string;
  fragmentSummary: string;
  similarity: number;
  valenceWeight: number;
  priorityWeight: number;
  contributionToA: number;
  contributionToB: number;
  favoredOption: 'OPTION_A' | 'OPTION_B' | 'NEUTRAL';
}

export interface RegretBreakdown {
  historicalRegretRate: number;
  valenceVariance: number;
  optionNegativityA: number;
  optionNegativityB: number;
  baseRegret: number;
  regretRiskA: number;
  regretRiskB: number;
  feedbackCount: number;
  dataReliability: 'LOW' | 'MEDIUM' | 'HIGH';
  isOptionASafer: boolean;
  formula: string;
}

export interface CalculationParameters {
  lambda: number;
  regretPrior: number;
  priorityAxisBoost: number;
  volatilityWeight: number;
  negativityWeight: number;
}

export interface ScoreBreakdown {
  scoreA: number;
  scoreB: number;
  scoreDifference: number;
  formula: string;
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
