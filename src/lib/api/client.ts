/**
 * API 클라이언트 기본 설정
 * aletheia-core API와 통신
 */

// 개발 환경에서는 Next.js rewrites를 통해 프록시되므로 상대 경로 사용
// 프로덕션에서는 직접 API 서버 URL 사용
const API_BASE_URL = typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
  ? ''  // 브라우저 + 개발환경: Next.js 프록시 사용 (상대 경로)
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');  // SSR 또는 프로덕션

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

export class TimeoutError extends Error {
  constructor(public timeoutMs: number) {
    super(`요청 시간이 초과되었습니다 (${timeoutMs / 1000}초). 네트워크 연결을 확인해주세요.`);
    this.name = 'TimeoutError';
  }
}

// 기본 타임아웃 (180초)
const DEFAULT_TIMEOUT_MS = 180000;

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  timeoutMs?: number;
}

class ApiClient {
  private baseUrl: string;
  private userId: string | null = null;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ============ Token Management ============

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pros-auth-token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('pros-auth-token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pros-auth-token');
    }
  }

  // ============ User ID Management (Legacy) ============

  setUserId(userId: string) {
    this.userId = userId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pros-user-id', userId);
    }
  }

  getUserId(): string | null {
    if (this.userId) return this.userId;
    if (typeof window !== 'undefined') {
      this.userId = localStorage.getItem('pros-user-id');
    }
    return this.userId;
  }

  clearUserId() {
    this.userId = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pros-user-id');
    }
  }

  // ============ URL Building ============

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const path = `/api${endpoint}`;

    // baseUrl이 비어있으면 상대 경로 사용 (Next.js 프록시)
    if (!this.baseUrl) {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }
      const queryString = searchParams.toString();
      return queryString ? `${path}?${queryString}` : path;
    }

    // baseUrl이 있으면 절대 URL 생성
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  // ============ Request Methods ============

  /**
   * 인증이 필요한 요청 (JWT 토큰 사용)
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, timeoutMs = DEFAULT_TIMEOUT_MS, signal: externalSignal, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // JWT 토큰이 있으면 Authorization 헤더 추가
    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    // 기존 X-User-Id 헤더도 유지 (점진적 마이그레이션)
    const userId = this.getUserId();
    if (userId) {
      (headers as Record<string, string>)['X-User-Id'] = userId;
    }

    // 인증 정보가 하나도 없으면 에러
    if (!token && !userId) {
      throw new ApiError(401, 'Not authenticated');
    }

    // 타임아웃 AbortController 설정
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

    // 외부 signal과 타임아웃 signal 결합
    const combinedSignal = externalSignal
      ? this.combineAbortSignals(externalSignal, timeoutController.signal)
      : timeoutController.signal;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: combinedSignal,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }
        throw new ApiError(response.status, response.statusText, errorData);
      }

      // 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // 외부에서 abort한 경우 vs 타임아웃으로 abort한 경우 구분
        if (timeoutController.signal.aborted && !externalSignal?.aborted) {
          throw new TimeoutError(timeoutMs);
        }
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * 여러 AbortSignal을 결합
   */
  private combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort();
        break;
      }
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
    return controller.signal;
  }

  /**
   * 인증 없이 요청 (로그인/회원가입용)
   */
  async requestWithoutAuth<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, timeoutMs = DEFAULT_TIMEOUT_MS, signal: externalSignal, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 타임아웃 AbortController 설정
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

    // 외부 signal과 타임아웃 signal 결합
    const combinedSignal = externalSignal
      ? this.combineAbortSignals(externalSignal, timeoutController.signal)
      : timeoutController.signal;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: combinedSignal,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }
        throw new ApiError(response.status, response.statusText, errorData);
      }

      // 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        if (timeoutController.signal.aborted && !externalSignal?.aborted) {
          throw new TimeoutError(timeoutMs);
        }
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    signal?: AbortSignal
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params, signal });
  }

  async post<T>(endpoint: string, data?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      signal,
    });
  }

  async postWithoutAuth<T>(endpoint: string, data?: unknown, signal?: AbortSignal): Promise<T> {
    return this.requestWithoutAuth<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      signal,
    });
  }

  async put<T>(endpoint: string, data?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      signal,
    });
  }

  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', signal });
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient(API_BASE_URL);

// UUID 생성 유틸리티
export function generateUserId(): string {
  return crypto.randomUUID();
}

// OAuth URL 헬퍼
export function getOAuthUrl(provider: 'google' | 'github'): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return `${baseUrl}/oauth2/authorization/${provider}`;
}
