# aletheia-front

PROS (Personal Reasoning OS) 프론트엔드 - 개인 의사결정 지원 시스템 UI

## 개요

PROS는 "AI가 결정하는 것이 아닌, 과거의 나를 불러오는 시스템"입니다.

### 핵심 철학
- **추천 금지**: 시스템은 절대 "A를 선택하세요"라고 말하지 않습니다
- **확률 ≠ 예측**: P(A|Me)는 "나의 패턴과의 적합도"이지 성공 확률이 아닙니다
- **충돌 보존**: 가치 간 갈등은 문제가 아닌 인간의 복잡성입니다
- **불변 기록**: 과거 생각은 수정 불가, soft-delete만 가능합니다

## 기술 스택

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **State**: Zustand (with persist middleware)
- **Charts**: Recharts
- **Testing**: Vitest + Testing Library
- **Security**: DOMPurify (XSS prevention)
- **API**: aletheia-core REST API 연동 (JWT 인증)

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- aletheia-core 백엔드 서버 실행 중

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
npm run build
npm start
```

### 테스트

```bash
# 테스트 실행 (watch 모드)
npm run test

# 테스트 실행 (단일 실행)
npm run test:run

# 테스트 커버리지
npm run test:coverage
```

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 인증 페이지 (비인증 사용자)
│   │   ├── login/           # 로그인
│   │   └── register/        # 회원가입
│   ├── (main)/              # 메인 페이지 (인증 필요)
│   │   ├── dashboard/       # 대시보드
│   │   ├── fragments/       # 생각 기록
│   │   ├── decisions/       # 의사결정
│   │   ├── values/          # 가치 그래프
│   │   └── settings/        # 설정
│   └── onboarding/          # 온보딩
│
├── components/
│   ├── ui/                  # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── SafeText.tsx     # XSS 방지 텍스트 컴포넌트
│   │   └── ...
│   ├── layout/              # 레이아웃 컴포넌트
│   ├── fragments/           # Fragment 관련
│   ├── decisions/           # Decision 관련
│   └── values/              # Value Graph 관련
│
├── hooks/                   # 커스텀 React 훅
│   ├── useAsync.ts          # 비동기 작업 상태 관리
│   └── index.ts
│
├── lib/
│   ├── api/                 # API 클라이언트
│   │   ├── client.ts        # 기본 API 클라이언트 (JWT 인증)
│   │   ├── auth.ts          # 인증 API
│   │   ├── fragments.ts     # Fragment API
│   │   ├── decisions.ts     # Decision API
│   │   └── values.ts        # Value Graph API
│   ├── sanitize.ts          # 콘텐츠 새니타이징 유틸
│   └── utils.ts             # 유틸리티 함수
│
├── stores/                  # Zustand 스토어
│   └── authStore.ts         # 인증 상태 관리
│
├── test/                    # 테스트 설정
│   └── setup.ts
│
└── types/                   # TypeScript 타입 정의
    ├── auth.ts              # 인증 관련 타입
    ├── fragment.ts
    ├── decision.ts
    └── value.ts
```

## 인증 시스템

JWT 기반 인증을 사용합니다:

### 인증 흐름
1. 사용자가 로그인/회원가입
2. 서버에서 JWT 토큰 발급
3. 토큰을 localStorage에 저장
4. 모든 API 요청에 `Authorization: Bearer <token>` 헤더 포함
5. 토큰 만료 시 자동 로그아웃

### 보호된 라우트
- `(main)` 그룹의 모든 페이지는 인증 필요
- 미인증 사용자는 `/login`으로 리다이렉트
- 온보딩 미완료 시 `/onboarding`으로 리다이렉트

## API 연동

aletheia-core의 API 엔드포인트와 연동됩니다:

### Auth API (3개)
- `POST /v1/auth/register` - 회원가입
- `POST /v1/auth/login` - 로그인
- `GET /v1/auth/me` - 현재 사용자 조회

### Fragment API (5개)
- `POST /v1/fragments` - 생각 기록 생성
- `GET /v1/fragments/{id}` - 단일 기록 조회
- `GET /v1/fragments` - 기록 목록 조회
- `DELETE /v1/fragments/{id}` - 기록 숨기기
- `GET /v1/fragments/similar` - 유사 기록 검색

### Decision API (6개)
- `POST /v1/decisions` - 의사결정 생성
- `GET /v1/decisions/{id}` - 단일 결정 조회
- `GET /v1/decisions/{id}/explanation` - LLM 설명 조회
- `GET /v1/decisions` - 결정 목록 조회
- `POST /v1/decisions/{id}/feedback` - 피드백 제출
- `GET /v1/decisions/pending-feedback` - 피드백 대기 조회

### Value Graph API (6개)
- `GET /v1/values` - 전체 가치 그래프
- `GET /v1/values/{axis}` - 특정 가치축 조회
- `GET /v1/values/axes` - 가치축 정의 조회
- `GET /v1/values/edges` - 가치 관계 조회
- `GET /v1/values/conflicts` - 가치 충돌 조회
- `GET /v1/values/summary` - 가치 요약 조회

## 주요 기능

### 생각 기록 (Fragments)
- 자유로운 텍스트 기록
- 감정 상태 선택 (기분, 각성도)
- 주제 태그 지정
- 유사한 과거 기록 검색

### 의사결정 분석 (Decisions)
- A/B 선택지 비교 분석
- 가치 기반 적합도 계산
- LLM 기반 설명 생성
- 결정 후 피드백 수집

### 가치 그래프 (Values)
- 6개 가치축 레이더 차트
- 가치 간 관계 시각화
- 가치 충돌 감지 및 표시
- 시간에 따른 가치 변화 추적

## 보안

- **XSS 방지**: DOMPurify를 사용한 사용자/AI 생성 콘텐츠 새니타이징
- **JWT 토큰**: 안전한 인증 토큰 관리
- **자동 로그아웃**: 401 에러 시 자동 로그아웃 및 토큰 삭제

## 접근성 (a11y)

- 폼 라벨과 입력 필드 연결 (`htmlFor`, `id`)
- ARIA 속성 (`aria-required`, `aria-pressed`, `aria-hidden`)
- 에러 메시지 `role="alert"` 적용
- 탭 네비게이션 지원 (`role="tablist"`)
- 스크린 리더용 숨김 텍스트 (`.sr-only`)
- 키보드 포커스 인디케이터

## 라이선스

MIT
