/**
 * Authentication API
 */

import { apiClient } from './client';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

export const authApi = {
  /**
   * 로그인
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.postWithoutAuth<AuthResponse>('/v1/auth/login', data);
  },

  /**
   * 회원가입
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.postWithoutAuth<AuthResponse>('/v1/auth/register', data);
  },

  /**
   * 현재 사용자 정보 조회 (토큰 검증용)
   */
  async me(): Promise<User> {
    return apiClient.get<User>('/v1/users/me');
  },
};
