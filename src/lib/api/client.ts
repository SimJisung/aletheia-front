/**
 * API 클라이언트 기본 설정
 * aletheia-core API와 통신
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

class ApiClient {
  private baseUrl: string;
  private userId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

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

  private buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(`${this.baseUrl}/api${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const userId = this.getUserId();
    if (!userId) {
      throw new ApiError(401, 'User ID not set');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
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
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient(API_BASE_URL);

// UUID 생성 유틸리티
export function generateUserId(): string {
  return crypto.randomUUID();
}
