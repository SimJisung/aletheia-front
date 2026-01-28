/**
 * Fragment API 클라이언트
 */

import { apiClient } from './client';
import type {
  ThoughtFragment,
  CreateFragmentRequest,
  FragmentListResponse,
  SimilarFragmentResult,
} from '@/types';

const BASE_PATH = '/v1/fragments';

export const fragmentsApi = {
  /**
   * 새 생각 기록 생성
   * POST /v1/fragments
   */
  async create(request: CreateFragmentRequest): Promise<ThoughtFragment> {
    return apiClient.post<ThoughtFragment>(BASE_PATH, request);
  },

  /**
   * 단일 기록 조회
   * GET /v1/fragments/{id}
   */
  async getById(id: string): Promise<ThoughtFragment> {
    return apiClient.get<ThoughtFragment>(`${BASE_PATH}/${id}`);
  },

  /**
   * 기록 목록 조회 (페이지네이션)
   * GET /v1/fragments
   */
  async list(limit = 20, offset = 0): Promise<FragmentListResponse> {
    return apiClient.get<FragmentListResponse>(BASE_PATH, { limit, offset });
  },

  /**
   * 기록 soft-delete (숨기기)
   * DELETE /v1/fragments/{id}
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete(`${BASE_PATH}/${id}`);
  },

  /**
   * 유사 기록 검색 (의미 기반)
   * GET /v1/fragments/similar
   */
  async findSimilar(queryText: string, topK = 10): Promise<SimilarFragmentResult[]> {
    return apiClient.get<SimilarFragmentResult[]>(`${BASE_PATH}/similar`, {
      queryText,
      topK,
    });
  },
};
