/**
 * Decision API 클라이언트
 */

import { apiClient } from './client';
import type {
  Decision,
  CreateDecisionRequest,
  DecisionListResponse,
  DecisionExplanation,
  FeedbackResponse,
  SubmitFeedbackRequest,
} from '@/types';

const BASE_PATH = '/v1/decisions';

export const decisionsApi = {
  /**
   * 새 의사결정 생성
   * POST /v1/decisions
   */
  async create(request: CreateDecisionRequest): Promise<Decision> {
    return apiClient.post<Decision>(BASE_PATH, request);
  },

  /**
   * 단일 결정 조회
   * GET /v1/decisions/{id}
   * @param detail true일 경우 CalculationBreakdown 상세 정보 포함
   */
  async getById(id: string, options?: { detail?: boolean; signal?: AbortSignal }): Promise<Decision> {
    const { detail = false, signal } = options || {};
    return apiClient.get<Decision>(`${BASE_PATH}/${id}`, detail ? { detail: true } : undefined, signal);
  },

  /**
   * 결정 목록 조회 (페이지네이션)
   * GET /v1/decisions
   * @param detail true일 경우 각 결정에 CalculationBreakdown 포함
   */
  async list(options?: { limit?: number; offset?: number; detail?: boolean }): Promise<DecisionListResponse> {
    const { limit = 20, offset = 0, detail = false } = options || {};
    return apiClient.get<DecisionListResponse>(BASE_PATH, { limit, offset, ...(detail ? { detail: true } : {}) });
  },

  /**
   * LLM 생성 설명 조회
   * GET /v1/decisions/{id}/explanation
   */
  async getExplanation(id: string, signal?: AbortSignal): Promise<DecisionExplanation> {
    return apiClient.get<DecisionExplanation>(`${BASE_PATH}/${id}/explanation`, undefined, signal);
  },

  /**
   * 피드백 제출
   * POST /v1/decisions/{id}/feedback
   * 반환값에 impact 정보 포함 (학습 효과 등)
   */
  async submitFeedback(id: string, request: SubmitFeedbackRequest): Promise<FeedbackResponse> {
    return apiClient.post<FeedbackResponse>(`${BASE_PATH}/${id}/feedback`, request);
  },

  /**
   * 피드백 대기 중인 결정 조회 (24-72시간)
   * GET /v1/decisions/pending-feedback
   * @param detail true일 경우 CalculationBreakdown 포함
   */
  async getPendingFeedback(options?: { detail?: boolean }): Promise<Decision[]> {
    const { detail = false } = options || {};
    return apiClient.get<Decision[]>(`${BASE_PATH}/pending-feedback`, detail ? { detail: true } : undefined);
  },
};
