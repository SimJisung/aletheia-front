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
  ValueImportance,
  SetValueImportanceRequest,
} from '@/types';

const BASE_PATH = '/v1/values';

export const valuesApi = {
  /**
   * 전체 가치 그래프 조회
   * GET /v1/values
   */
  async getGraph(signal?: AbortSignal): Promise<ValueGraph> {
    return apiClient.get<ValueGraph>(BASE_PATH, undefined, signal);
  },

  /**
   * 특정 가치축 조회
   * GET /v1/values/{axis}
   */
  async getAxis(axis: ValueAxis, signal?: AbortSignal): Promise<ValueNode> {
    return apiClient.get<ValueNode>(`${BASE_PATH}/${axis}`, undefined, signal);
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
  async getEdges(signal?: AbortSignal): Promise<ValueEdge[]> {
    return apiClient.get<ValueEdge[]>(`${BASE_PATH}/edges`, undefined, signal);
  },

  /**
   * 가치 충돌(긴장) 조회
   * GET /v1/values/conflicts
   */
  async getConflicts(signal?: AbortSignal): Promise<ValueConflict[]> {
    return apiClient.get<ValueConflict[]>(`${BASE_PATH}/conflicts`, undefined, signal);
  },

  /**
   * 가치 프로필 요약 조회
   * GET /v1/values/summary
   */
  async getSummary(signal?: AbortSignal): Promise<ValueSummary> {
    return apiClient.get<ValueSummary>(`${BASE_PATH}/summary`, undefined, signal);
  },

  /**
   * 가치 중요도 설정 조회
   * GET /v1/values/importance
   */
  async getImportance(signal?: AbortSignal): Promise<ValueImportance> {
    return apiClient.get<ValueImportance>(`${BASE_PATH}/importance`, undefined, signal);
  },

  /**
   * 가치 중요도 설정/수정
   * PUT /v1/values/importance
   * 부분 업데이트 지원 (수정하려는 축만 전송)
   */
  async setImportance(
    data: SetValueImportanceRequest,
    signal?: AbortSignal
  ): Promise<ValueImportance> {
    return apiClient.put<ValueImportance>(`${BASE_PATH}/importance`, data, signal);
  },
};
