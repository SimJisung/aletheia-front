/**
 * 타입 정의 통합 export
 */

export * from './auth';
export * from './fragment';
export * from './decision';
export * from './value';

// API 공통 타입
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  path?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

// 사용자 관련 타입
export interface UserSettings {
  id: string;
  userId: string;
  lambda: number; // 후회 민감도 가중치
  regretPrior: number; // 과거 후회 기준선
  updatedAt: string;
}

// 온보딩 상태
export type OnboardingStep = 'welcome' | 'first-thought' | 'values' | 'complete';

export interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  isComplete: boolean;
}
