/**
 * 인증 API 클라이언트
 */

import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class AuthApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`Auth Error: ${status} ${statusText}`);
    this.name = 'AuthApiError';
  }
}

/**
 * 인증 API 클라이언트
 * 인증이 필요 없는 공개 엔드포인트용
 */
class AuthApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }
      throw new AuthApiError(response.status, response.statusText, errorData);
    }

    return response.json();
  }

  /**
   * 로그인
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 회원가입
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 현재 사용자 정보 조회 (토큰 검증)
   */
  async getCurrentUser(token: string): Promise<User> {
    return this.request<User>('/v1/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * 로그아웃 (서버 측 세션 무효화가 필요한 경우)
   */
  async logout(token: string): Promise<void> {
    try {
      await this.request<void>('/v1/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // 로그아웃은 실패해도 클라이언트에서 토큰을 삭제하면 됨
    }
  }
}

export const authApi = new AuthApi(API_BASE_URL);
export { AuthApiError };
