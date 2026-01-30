/**
 * 인증 관련 타입 정의
 */

// 사용자 정보
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 회원가입 요청
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

// 인증 응답
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// 인증 상태
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 비밀번호 변경 요청
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 폼 유효성 검사 에러
export interface ValidationError {
  field: string;
  message: string;
}
