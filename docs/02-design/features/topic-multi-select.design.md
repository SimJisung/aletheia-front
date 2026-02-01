# Design: 관련 주제 다중 선택 기능

## 1. 컴포넌트 인터페이스 설계

### 1.1 TopicSelector 변경

```typescript
// 변경 전
interface TopicSelectorProps {
  value: string | null;
  onChange: (topic: string | null) => void;
  allowCustom?: boolean;
}

// 변경 후
interface TopicSelectorProps {
  value: string[];  // 다중 선택 배열
  onChange: (topics: string[]) => void;
  allowCustom?: boolean;
  maxTopics?: number;  // 최대 선택 개수 (기본값: 5)
}
```

### 1.2 CustomTopicModal 변경

```typescript
// 변경 전
interface CustomTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (topic: string) => void;
  onClear?: () => void;
  initialValue?: string;
}

// 변경 후
interface CustomTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (topic: string) => void;  // 추가 전용
  existingTopics: string[];  // 중복 체크용
}
```

## 2. 유틸리티 함수

### 2.1 직렬화/역직렬화 (`src/lib/utils/topics.ts`)

```typescript
/**
 * 주제 배열을 쉼표 구분 문자열로 변환 (API 전송용)
 */
export function serializeTopics(topics: string[]): string | undefined {
  if (topics.length === 0) return undefined;
  return topics.join(',');
}

/**
 * 쉼표 구분 문자열을 주제 배열로 변환 (API 응답 파싱용)
 */
export function parseTopics(topicHint: string | undefined | null): string[] {
  if (!topicHint) return [];
  return topicHint.split(',').map(t => t.trim()).filter(Boolean);
}

/**
 * 프리셋 주제인지 확인
 */
export function isPresetTopic(topic: string): boolean {
  return TOPIC_PRESETS.some(p => p.id === topic);
}

/**
 * 주제 라벨 가져오기 (프리셋이면 라벨, 커스텀이면 그대로)
 */
export function getTopicLabel(topic: string): string {
  const preset = TOPIC_PRESETS.find(p => p.id === topic);
  return preset ? preset.label : topic;
}
```

## 3. UI 동작 상세

### 3.1 TopicSelector 동작

```
┌─────────────────────────────────────────────────────────────┐
│ 관련 주제 (선택)                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [💼 일/커리어]  [👥 관계]  [💚 건강]  [💰 재정]              │
│       ↑선택됨        ↑선택됨                                  │
│                                                              │
│  [🌱 성장]  [🏠 일상]  [미래 ×]  [+ 직접 입력]               │
│                         ↑커스텀                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| 동작 | 결과 |
|------|------|
| 프리셋 클릭 (미선택) | 배열에 추가 |
| 프리셋 클릭 (선택됨) | 배열에서 제거 |
| 커스텀 주제 X 클릭 | 해당 커스텀만 제거 |
| "+ 직접 입력" 클릭 | CustomTopicModal 열기 |
| 최대 개수 도달 시 | 추가 선택 비활성화 + 안내 메시지 |

### 3.2 CustomTopicModal 동작

- 입력 후 "추가" → 기존 선택에 새 주제 추가
- 중복 체크: 이미 선택된 주제면 에러 표시
- 프리셋 ID와 동일한 커스텀 입력 금지

## 4. 스타일링

### 4.1 선택된 상태
```css
/* 프리셋 선택됨 */
border-primary-500 bg-primary-50 text-primary-700

/* 커스텀 선택됨 (삭제 버튼 포함) */
border-primary-500 bg-primary-50 text-primary-700
```

### 4.2 최대 개수 도달 시
```css
/* 비선택 항목 비활성화 */
opacity-50 cursor-not-allowed
```

## 5. 데이터 흐름

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│ TopicSelector │ → │ serializeTopics() │ → │ API Request │
│ value: []    │    │ "work,health,미래"│    │ topicHint   │
└─────────────┘    └──────────────────┘    └─────────────┘

┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│ API Response │ → │ parseTopics()     │ → │ TopicSelector│
│ topicHint    │    │ ["work","health"] │    │ value: []   │
└─────────────┘    └──────────────────┘    └─────────────┘
```

## 6. 변경 파일 목록

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `src/components/fragments/TopicSelector.tsx` | 수정 | 다중 선택 로직 |
| `src/components/fragments/CustomTopicModal.tsx` | 수정 | 추가 전용 모드 |
| `src/lib/utils/topics.ts` | 신규 | 직렬화 유틸리티 |
| `src/app/onboarding/page.tsx` | 수정 | TopicSelector 호출부 |
| `src/app/(main)/fragments/page.tsx` | 수정 | TopicSelector 호출부 |

## 7. 테스트 시나리오

| ID | 시나리오 | 예상 결과 |
|----|----------|-----------|
| T-1 | 프리셋 2개 선택 | 두 주제 모두 선택 상태 표시 |
| T-2 | 커스텀 2개 추가 | 두 커스텀 모두 chip으로 표시 |
| T-3 | 프리셋 1 + 커스텀 1 | 혼합 선택 가능 |
| T-4 | 5개 선택 후 추가 시도 | 추가 버튼 비활성화 |
| T-5 | 커스텀 X 클릭 | 해당 커스텀만 삭제 |
| T-6 | 기존 단일 topicHint 데이터 | 정상 파싱 및 표시 |

---
**생성일**: 2026-01-31
**상태**: Draft
**Plan 참조**: `docs/01-plan/features/topic-multi-select.plan.md`
