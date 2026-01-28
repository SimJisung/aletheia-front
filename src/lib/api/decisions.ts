/**
 * Decision API 클라이언트
 */

import { apiClient } from './client';
import type {
  Decision,
  CreateDecisionRequest,
  DecisionListResponse,
  DecisionExplanation,
  DecisionFeedback,
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
   */
  async getById(id: string): Promise<Decision> {
    return apiClient.get<Decision>(`${BASE_PATH}/${id}`);
  },

  /**
   * 결정 목록 조회 (페이지네이션)
   * GET /v1/decisions
   */
  async list(limit = 20, offset = 0): Promise<DecisionListResponse> {
    return apiClient.get<DecisionListResponse>(BASE_PATH, { limit, offset });
  },

  /**
   * LLM 생성 설명 조회
   * GET /v1/decisions/{id}/explanation
   */
  async getExplanation(id: string): Promise<DecisionExplanation> {
    return apiClient.get<DecisionExplanation>(`${BASE_PATH}/${id}/explanation`);
  },

  /**
   * 피드백 제출
   * POST /v1/decisions/{id}/feedback
   */
  async submitFeedback(id: string, request: SubmitFeedbackRequest): Promise<DecisionFeedback> {
    return apiClient.post<DecisionFeedback>(`${BASE_PATH}/${id}/feedback`, request);
  },

  /**
   * 피드백 대기 중인 결정 조회 (24-72시간)
   * GET /v1/decisions/pending-feedback
   */
  async getPendingFeedback(): Promise<Decision[]> {
    return apiClient.get<Decision[]>(`${BASE_PATH}/pending-feedback`);
  },
};
