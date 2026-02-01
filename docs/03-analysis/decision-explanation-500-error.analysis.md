# Gap Analysis: Decision Explanation 500 Error

## 분석 일자
2026-02-01

## 문제 요약
`GET /api/v1/decisions/{id}/explanation` 호출 시 500 에러 발생.
백엔드 로그에 에러 메시지가 출력되지 않음.

---

## 1. 로그 타임라인 분석

| 시간 | 이벤트 | 비고 |
|------|--------|------|
| 01:29:31.605 | JWT 인증 성공 | ✅ 정상 |
| 01:29:31.609 | Decision 조회 SQL | ✅ 정상 |
| 01:29:31.615 | Feedback 조회 SQL | ✅ 정상 |
| 01:29:31.635 | ThoughtFragment 조회 SQL (5개) | ✅ 정상 |
| 01:29:31.644 | LlmExplanationAdapter 시작 | ⚠️ 마지막 로그 |
| 01:30:02.365 | ASYNC 디스패치 (30초 후) | ❓ 에러 없음 |

### 핵심 발견
- **30초 갭**: LLM 호출 시작 후 약 30초 동안 로그 없음
- **에러 로그 부재**: 500 에러임에도 예외 스택트레이스 없음
- **ASYNC 디스패치**: Spring의 비동기 처리 중 문제 발생 가능성

---

## 2. 추정 원인 (우선순위 순)

### 원인 1: LLM API 타임아웃 (가장 유력)
- **근거**: 30초 갭은 일반적인 LLM API 타임아웃 값
- **증상**: 타임아웃 예외가 제대로 처리되지 않아 500으로 변환
- **백엔드 확인 필요**: `LlmExplanationAdapter`의 타임아웃 설정

### 원인 2: 예외 처리 누락
- **근거**: 에러 로그가 전혀 없음
- **증상**: `@ControllerAdvice`나 글로벌 예외 핸들러에서 누락
- **백엔드 확인 필요**: 비동기 컨텍스트에서의 예외 로깅

### 원인 3: LLM API 키/설정 문제
- **근거**: LLM 호출 시작 직후 실패
- **증상**: 인증 실패나 잘못된 설정으로 조용히 실패
- **백엔드 확인 필요**: LLM 서비스 설정 및 API 키

---

## 3. 프론트엔드 분석

### 현재 구현 (DecisionResultView.tsx:24-38)
```typescript
const loadExplanation = async () => {
  if (explanation) return;
  setIsLoadingExplanation(true);
  setExplanationError(null);
  try {
    const data = await decisionsApi.getExplanation(decision.id);
    setExplanation(data.explanation);
  } catch (err) {
    console.error('Failed to load explanation:', err);
    setExplanationError(MESSAGES.errors.loadExplanation);
  } finally {
    setIsLoadingExplanation(false);
  }
};
```

### 프론트엔드 문제점
| 항목 | 상태 | 설명 |
|------|------|------|
| 에러 처리 | ⚠️ 개선 필요 | 에러 종류 구분 없이 일반 메시지 |
| 타임아웃 처리 | ⚠️ 개선 필요 | 180초 기본값, LLM 특성 고려 안됨 |
| 로딩 상태 UX | ⚠️ 개선 필요 | LLM 응답 지연에 대한 안내 없음 |
| 재시도 로직 | ⚠️ 개선 필요 | 단순 재시도만 가능 |

### API Client (client.ts)
- 기본 타임아웃: **180초** (DEFAULT_TIMEOUT_MS = 180000)
- explanation API는 별도 타임아웃 지정 없음

---

## 4. 권장 조치사항

### 즉시 조치 (프론트엔드)

#### 4.1 LLM 호출에 대한 UX 개선
- LLM 응답 대기 중임을 명시적으로 안내
- 예상 대기 시간 표시 (30초~1분)
- 중간 상태 표시 (생성 중...)

#### 4.2 에러 메시지 구체화
```typescript
// 현재: 일반적인 에러 메시지
setExplanationError(MESSAGES.errors.loadExplanation);

// 개선: 에러 유형별 구체적 메시지
if (err instanceof TimeoutError) {
  setExplanationError('AI 분석에 시간이 오래 걸리고 있습니다. 잠시 후 다시 시도해주세요.');
} else if (err instanceof ApiError && err.status === 500) {
  setExplanationError('서버에서 분석 생성 중 문제가 발생했습니다.');
}
```

### 백엔드 확인 필요 사항

#### 4.3 LlmExplanationAdapter 점검
- [ ] LLM API 호출 타임아웃 설정 확인
- [ ] 예외 로깅 추가 (특히 비동기 컨텍스트)
- [ ] LLM 서비스 연결 상태 헬스체크

#### 4.4 글로벌 예외 핸들러 점검
- [ ] `@Async` 메서드의 예외 처리 확인
- [ ] `@ControllerAdvice`에서 모든 예외 로깅 여부

---

## 5. Match Rate

| 항목 | 점수 | 비고 |
|------|------|------|
| 프론트엔드 에러 처리 | 60% | 기본 처리만 구현 |
| UX (로딩 상태) | 50% | LLM 특성 미반영 |
| 타임아웃 처리 | 70% | 구현됨, 최적화 필요 |
| 백엔드 로깅 | 0% | 확인 불가 (프론트 범위 외) |

**전체 Match Rate**: 60%

---

## 6. 다음 단계

### Plan (계획)
1. 프론트엔드 UX 개선 계획 수립
2. 백엔드 팀에 로깅 개선 요청

### Do (실행)
1. DecisionResultView 컴포넌트 개선
2. 에러 메시지 구체화
3. 로딩 상태 UX 개선

### Check (검증)
1. 개선 후 재테스트
2. 에러 시나리오별 동작 확인

---

## 부록: 관련 파일

- `src/lib/api/client.ts` - API 클라이언트
- `src/lib/api/decisions.ts` - Decision API
- `src/components/decisions/DecisionResultView.tsx` - UI 컴포넌트
- `next.config.js` - 프록시 설정
