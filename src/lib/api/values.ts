/**
 * Value Graph API 클라이언트
 */

import { apiClient } from './client';
import type {
  ValueGraph,
  ValueNode,
  ValueEdge,
  ValueAxisDefinition,
  ValueConflict,
  ValueSummary,
  ValueAxis,
} from '@/types';

const BASE_PATH = '/v1/values';

export const valuesApi = {
  /**
   * 전체 가치 그래프 조회
   * GET /v1/values
   */
  async getGraph(): Promise<ValueGraph> {
    return apiClient.get<ValueGraph>(BASE_PATH);
  },

  /**
   * 특정 가치축 조회
   * GET /v1/values/{axis}
   */
  async getAxis(axis: ValueAxis): Promise<ValueNode> {
    return apiClient.get<ValueNode>(`${BASE_PATH}/${axis}`);
  },

  /**
   * 8개 가치축 정의 조회
   * GET /v1/values/axes
   */
  async getAxesDefinitions(): Promise<ValueAxisDefinition[]> {
    return apiClient.get<ValueAxisDefinition[]>(`${BASE_PATH}/axes`);
  },

  /**
   * 가치 관계(엣지) 조회
   * GET /v1/values/edges
   */
  async getEdges(): Promise<ValueEdge[]> {
    return apiClient.get<ValueEdge[]>(`${BASE_PATH}/edges`);
  },

  /**
   * 가치 충돌(긴장) 조회
   * GET /v1/values/conflicts
   */
  async getConflicts(): Promise<ValueConflict[]> {
    return apiClient.get<ValueConflict[]>(`${BASE_PATH}/conflicts`);
  },

  /**
   * 가치 프로필 요약 조회
   * GET /v1/values/summary
   */
  async getSummary(): Promise<ValueSummary> {
    return apiClient.get<ValueSummary>(`${BASE_PATH}/summary`);
  },
};
