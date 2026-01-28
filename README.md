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
- **State**: Zustand
- **Charts**: Recharts
- **API**: aletheia-core REST API 연동

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

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── (main)/              # 인증된 사용자 페이지
│   │   ├── dashboard/       # 대시보드
│   │   ├── fragments/       # 생각 기록
│   │   ├── decisions/       # 의사결정
│   │   ├── values/          # 가치 그래프
│   │   └── settings/        # 설정
│   └── onboarding/          # 온보딩
│
├── components/
│   ├── ui/                  # 기본 UI 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   ├── fragments/           # Fragment 관련
│   ├── decisions/           # Decision 관련
│   └── values/              # Value Graph 관련
│
├── lib/
│   ├── api/                 # API 클라이언트
│   └── utils/               # 유틸리티 함수
│
├── stores/                  # Zustand 스토어
│
└── types/                   # TypeScript 타입 정의
```

## API 연동

aletheia-core의 17개 API 엔드포인트와 연동됩니다:

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

## 라이선스

MIT
