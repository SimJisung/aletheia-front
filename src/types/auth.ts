/**
 * Authentication related types
 */

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

// OAuth 프로바이더
export type OAuthProvider = 'google' | 'github';
