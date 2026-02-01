# PDCA Plan: 로그인 페이지 및 인증 처리

## 1. 개요

### 1.1 목표
aletheia-core 백엔드의 인증 API를 연동하여 프론트엔드에 로그인/회원가입 페이지 및 인증 처리 로직을 구현한다.

### 1.2 배경
현재 프론트엔드는 UUID 자동 생성 방식으로 사용자를 식별하고 있으나, 백엔드에는 이미 완전한 인증 시스템이 구현되어 있다:
- JWT 기반 이메일/비밀번호 인증
- OAuth2 소셜 로그인 (Google, GitHub)

## 2. 백엔드 API 분석

### 2.1 인증 엔드포인트

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | 회원가입 |
| POST | `/api/v1/auth/login` | 로그인 |
| GET | `/oauth2/authorization/google` | Google OAuth 시작 |
| GET | `/oauth2/authorization/github` | GitHub OAuth 시작 |
| GET | `/oauth/callback` | OAuth 콜백 (프론트엔드) |

### 2.2 Request/Response 형식

#### 회원가입 Request
```typescript
interface RegisterRequest {
  email: string;      // 필수, 이메일 형식
  password: string;   // 필수, 최소 8자
  name: string;       // 필수, 최대 100자
}
```

#### 로그인 Request
```typescript
interface LoginRequest {
  email: string;      // 필수, 이메일 형식
  password: string;   // 필수
}
```

#### AuthResponse (공통)
```typescript
interface AuthResponse {
  token: string;      // JWT 토큰
  user: {
    id: string;       // UUID
    email: string;
    name: string;
    createdAt: string; // ISO 8601
  };
}
```

### 2.3 OAuth2 콜백 파라미터
- 성공: `?token={jwt}&isNewUser={boolean}`
- 실패: `?error={code}&error_description={message}`

### 2.4 에러 응답

| Status | 의미 |
|--------|------|
| 401 | 잘못된 자격증명 / OAuth 전용 계정 |
| 403 | 비활성화된 계정 |
| 409 | 이메일 중복 (회원가입) |

## 3. 구현 계획

### 3.1 파일 구조

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx              # 로그인 페이지
│   ├── register/
│   │   └── page.tsx              # 회원가입 페이지
│   └── oauth/
│       └── callback/
│           └── page.tsx          # OAuth 콜백 처리
├── lib/
│   └── api/
│       └── auth.ts               # 인증 API 래퍼
├── stores/
│   └── userStore.ts              # 수정: 인증 상태 관리 추가
├── components/
│   └── auth/
│       ├── LoginForm.tsx         # 로그인 폼 컴포넌트
│       ├── RegisterForm.tsx      # 회원가입 폼 컴포넌트
│       └── SocialLoginButtons.tsx # OAuth 버튼
└── types/
    └── auth.ts                   # 인증 관련 타입
```

### 3.2 구현 단계

#### Phase 1: 타입 및 API 레이어 (Do)
1. `src/types/auth.ts` - 인증 관련 타입 정의
2. `src/lib/api/auth.ts` - 인증 API 클라이언트

#### Phase 2: 상태 관리 수정 (Do)
1. `userStore.ts` 수정
   - JWT 토큰 저장/관리
   - 인증 상태 관리 (isAuthenticated)
   - 로그인/로그아웃 액션
2. `apiClient.ts` 수정
   - Authorization 헤더 추가
   - 401 응답 시 토큰 갱신/로그아웃 처리

#### Phase 3: 인증 컴포넌트 (Do)
1. `LoginForm.tsx` - 이메일/비밀번호 입력 폼
2. `RegisterForm.tsx` - 회원가입 폼
3. `SocialLoginButtons.tsx` - Google/GitHub 버튼

#### Phase 4: 페이지 구현 (Do)
1. `/login` - 로그인 페이지
2. `/register` - 회원가입 페이지
3. `/oauth/callback` - OAuth 콜백 처리

#### Phase 5: 인증 플로우 통합 (Do)
1. 루트 페이지 수정: 인증 상태에 따른 리다이렉트
2. 보호된 라우트 처리
3. 온보딩 플로우 연결

## 4. 주요 설계 결정

### 4.1 토큰 저장
- localStorage에 저장 (기존 패턴 유지)
- 키: `pros-auth-token`

### 4.2 인증 상태 확인
- 앱 로드 시 토큰 유효성 검증
- API 호출 시 401 응답 처리

### 4.3 라우팅 보호
- 인증되지 않은 사용자: `/login`으로 리다이렉트
- 인증된 사용자가 로그인 페이지 접근: `/dashboard`로 리다이렉트

### 4.4 OAuth 플로우
1. 프론트엔드에서 백엔드 OAuth 엔드포인트로 리다이렉트
2. 백엔드가 OAuth 인증 처리
3. 백엔드가 프론트엔드 콜백 URL로 리다이렉트 (토큰 포함)
4. 프론트엔드에서 토큰 저장 및 상태 업데이트

## 5. 체크리스트

### 5.1 기능 요구사항
- [ ] 이메일/비밀번호 로그인
- [ ] 이메일/비밀번호 회원가입
- [ ] Google OAuth 로그인
- [ ] GitHub OAuth 로그인
- [ ] 로그아웃
- [ ] 인증 상태 유지 (새로고침 후에도)
- [ ] 보호된 라우트 접근 제어

### 5.2 UX 요구사항
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시 (이메일 중복, 잘못된 비밀번호 등)
- [ ] 폼 유효성 검사
- [ ] 반응형 디자인

### 5.3 보안 요구사항
- [ ] XSS 방지 (기존 SafeText 패턴 활용)
- [ ] CSRF 방지 (OAuth state 파라미터)
- [ ] 비밀번호 최소 요구사항 표시

## 6. 환경 설정

### 6.1 프론트엔드 환경변수
`.env.local`에 추가 필요:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 6.2 백엔드 환경변수
OAuth 사용 시 필요 (.env):
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
OAUTH2_SUCCESS_REDIRECT_URI=http://localhost:3000/oauth/callback
```

## 7. 위험 요소 및 대응

| 위험 | 대응 |
|------|------|
| OAuth 설정 미완료 | 이메일/비밀번호 인증 먼저 구현, OAuth는 조건부 렌더링 |
| 토큰 만료 | 401 응답 시 로그인 페이지로 리다이렉트 |
| CORS 이슈 | Next.js rewrites로 프록시 (이미 구현됨) |

---

**작성일**: 2026-01-31
**상태**: Plan 완료, Design 단계 진행 예정
