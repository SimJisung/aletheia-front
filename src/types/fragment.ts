/**
 * ThoughtFragment 타입 정의
 * aletheia-core의 ThoughtFragment 도메인 모델과 매핑
 */

export interface ThoughtFragment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  moodValence: number; // -1.0 ~ +1.0 (부정 ~ 긍정)
  arousal: number; // 0.0 ~ 1.0 (차분 ~ 활발)
  topicHint?: string;
  isDeleted: boolean;
}

export interface CreateFragmentRequest {
  text: string;
  topicHint?: string;
}

export interface FragmentListResponse {
  fragments: ThoughtFragment[];
  total: number;
  hasMore: boolean;
}

export interface SimilarFragmentResult {
  fragment: ThoughtFragment;
  similarity: number; // 0.0 ~ 1.0
}

// 감정 레벨 (UI용)
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
  valence: number; // API에 전송할 valence 값
}

// 감정 옵션 정의
export const MOOD_OPTIONS: MoodOption[] = [
  { level: 1, emoji: '😢', label: '힘듦', valence: -0.8 },
  { level: 2, emoji: '🙁', label: '별로', valence: -0.4 },
  { level: 3, emoji: '😐', label: '보통', valence: 0 },
  { level: 4, emoji: '🙂', label: '좋음', valence: 0.4 },
  { level: 5, emoji: '😄', label: '매우좋음', valence: 0.8 },
];

// 주제 힌트 프리셋
export const TOPIC_PRESETS = [
  { id: 'work', label: '일/커리어', icon: '💼' },
  { id: 'relationship', label: '관계', icon: '👥' },
  { id: 'health', label: '건강', icon: '💚' },
  { id: 'finance', label: '재정', icon: '💰' },
  { id: 'growth', label: '성장', icon: '🌱' },
  { id: 'life', label: '일상', icon: '🏠' },
] as const;

export type TopicPreset = (typeof TOPIC_PRESETS)[number]['id'];

// valence 값을 MoodLevel로 변환
export function valenceToMoodLevel(valence: number): MoodLevel {
  if (valence <= -0.6) return 1;
  if (valence <= -0.2) return 2;
  if (valence <= 0.2) return 3;
  if (valence <= 0.6) return 4;
  return 5;
}

// valence 값을 이모지로 변환
export function valenceToEmoji(valence: number): string {
  const level = valenceToMoodLevel(valence);
  return MOOD_OPTIONS.find((m) => m.level === level)?.emoji || '😐';
}
