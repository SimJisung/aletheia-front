# Design Document: 로그인 페이지 및 인증 처리

## 1. 타입 정의

### 1.1 src/types/auth.ts

```typescript
// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 회원가입 요청
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// 사용자 정보
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// 인증 응답
export interface AuthResponse {
  token: string;
  user: User;
}

// OAuth 에러
export interface OAuthError {
  error: string;
  error_description: string;
}

// OAuth 콜백 파라미터
export interface OAuthCallbackParams {
  token?: string;
  isNewUser?: string;
  error?: string;
  error_description?: string;
}
```

## 2. API 레이어

### 2.1 src/lib/api/auth.ts

```typescript
import { apiClient } from './client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

export const authApi = {
  // 로그인
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.postWithoutAuth<AuthResponse>('/v1/auth/login', data);
  },

  // 회원가입
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.postWithoutAuth<AuthResponse>('/v1/auth/register', data);
  },

  // 현재 사용자 정보 (토큰 검증용)
  async me(): Promise<User> {
    return apiClient.get<User>('/v1/users/me');
  },
};

// OAuth URL 생성 헬퍼
export const getOAuthUrl = (provider: 'google' | 'github'): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return `${baseUrl}/oauth2/authorization/${provider}`;
};
```

### 2.2 src/lib/api/client.ts 수정

```typescript
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  // 토큰 설정
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pros-auth-token', token);
    }
  }

  // 토큰 가져오기
  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('pros-auth-token');
    }
    return this.token;
  }

  // 토큰 삭제
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pros-auth-token');
    }
  }

  // 헤더에 Authorization 추가
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 기존 X-User-Id도 유지 (점진적 마이그레이션)
    const userId = this.getUserId();
    if (userId) {
      headers['X-User-Id'] = userId;
    }

    return headers;
  }

  // 인증 없이 요청 (로그인/회원가입용)
  async postWithoutAuth<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  }
}
```

## 3. 상태 관리

### 3.1 src/stores/userStore.ts 수정

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';
import type { User, AuthResponse } from '@/types/auth';

interface UserState {
  // 인증 상태
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // 온보딩 상태 (기존)
  onboarding: OnboardingState;

  // Actions
  initializeAuth: () => Promise<void>;
  login: (response: AuthResponse) => void;
  logout: () => void;

  // 온보딩 (기존)
  completeOnboardingStep: (step: OnboardingStep) => void;
  resetOnboarding: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
      onboarding: initialOnboarding,

      initializeAuth: async () => {
        const token = apiClient.getToken();

        if (!token) {
          set({ isInitialized: true, isAuthenticated: false });
          return;
        }

        try {
          // 토큰 유효성 검증 (선택적)
          // const user = await authApi.me();
          set({
            token,
            isAuthenticated: true,
            isInitialized: true,
          });
        } catch {
          apiClient.clearToken();
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isInitialized: true,
          });
        }
      },

      login: (response: AuthResponse) => {
        apiClient.setToken(response.token);
        apiClient.setUserId(response.user.id); // 기존 API 호환
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        apiClient.clearToken();
        apiClient.clearUserId();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          onboarding: initialOnboarding,
        });
      },

      // 기존 메서드 유지...
    }),
    {
      name: 'pros-user',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        onboarding: state.onboarding,
      }),
    }
  )
);
```

## 4. 컴포넌트 설계

### 4.1 LoginForm.tsx

```typescript
interface LoginFormProps {
  onSuccess?: () => void;
}

// 상태: email, password, isLoading, error
// 유효성 검사: 이메일 형식, 비밀번호 필수
// 에러 처리: 401 -> "이메일 또는 비밀번호가 올바르지 않습니다"
```

### 4.2 RegisterForm.tsx

```typescript
interface RegisterFormProps {
  onSuccess?: () => void;
}

// 상태: email, password, confirmPassword, name, isLoading, error
// 유효성 검사:
//   - 이메일 형식
//   - 비밀번호 8자 이상
//   - 비밀번호 확인 일치
//   - 이름 필수
// 에러 처리: 409 -> "이미 사용 중인 이메일입니다"
```

### 4.3 SocialLoginButtons.tsx

```typescript
// Google, GitHub 버튼
// 클릭 시 해당 OAuth URL로 이동
// OAuth 미설정 시 비활성화 또는 숨김
```

## 5. 페이지 구조

### 5.1 /login 페이지

```
┌─────────────────────────────────────┐
│              💡 PROS                │
│      Personal Reasoning OS          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 이메일                       │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 비밀번호                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        로그인               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ──────── 또는 ────────            │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │  Google  │  │  GitHub  │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  계정이 없으신가요? 회원가입        │
└─────────────────────────────────────┘
```

### 5.2 /register 페이지

```
┌─────────────────────────────────────┐
│              💡 PROS                │
│           회원가입                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 이름                         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 이메일                       │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 비밀번호 (8자 이상)          │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 비밀번호 확인                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        회원가입              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ──────── 또는 ────────            │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │  Google  │  │  GitHub  │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  이미 계정이 있으신가요? 로그인     │
└─────────────────────────────────────┘
```

### 5.3 /oauth/callback 페이지

- 로딩 스피너 표시
- 성공 시: 토큰 저장 → dashboard 이동
- 신규 사용자: 토큰 저장 → onboarding 이동
- 실패 시: 에러 메시지 → login 이동

## 6. 라우팅 플로우

```
[앱 시작]
    │
    ▼
[토큰 존재?] ──No──> [/login]
    │                    │
   Yes               [로그인 성공]
    │                    │
    ▼                    ▼
[온보딩 완료?] ◄────────┘
    │
   Yes──> [/dashboard]
    │
   No───> [/onboarding]
```

## 7. 에러 처리 매핑

| 백엔드 상태 | 프론트엔드 메시지 |
|------------|------------------|
| 401 (로그인) | 이메일 또는 비밀번호가 올바르지 않습니다 |
| 403 | 비활성화된 계정입니다. 관리자에게 문의하세요 |
| 409 | 이미 사용 중인 이메일입니다 |
| OAuth email_required | 이메일 정보를 가져올 수 없습니다 |
| OAuth account_deactivated | 비활성화된 계정입니다 |

## 8. 구현 순서

1. **types/auth.ts** - 타입 정의
2. **lib/api/client.ts** - 토큰 관리 추가
3. **lib/api/auth.ts** - 인증 API
4. **stores/userStore.ts** - 상태 관리 수정
5. **components/auth/*** - 폼 컴포넌트
6. **app/login/page.tsx** - 로그인 페이지
7. **app/register/page.tsx** - 회원가입 페이지
8. **app/oauth/callback/page.tsx** - OAuth 콜백
9. **app/page.tsx** - 루트 페이지 수정

---

**작성일**: 2026-01-31
**상태**: Design 완료, Do 단계 진행 예정
