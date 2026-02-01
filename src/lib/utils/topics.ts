/**
 * 주제 직렬화/역직렬화 유틸리티
 */

import { TOPIC_PRESETS } from '@/types';

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
  return topicHint
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * 프리셋 주제인지 확인
 */
export function isPresetTopic(topic: string): boolean {
  return TOPIC_PRESETS.some((p) => p.id === topic);
}

/**
 * 주제 라벨 가져오기 (프리셋이면 라벨, 커스텀이면 그대로)
 */
export function getTopicLabel(topic: string): string {
  const preset = TOPIC_PRESETS.find((p) => p.id === topic);
  return preset ? preset.label : topic;
}

/**
 * 주제 아이콘 가져오기 (프리셋이면 아이콘, 커스텀이면 undefined)
 */
export function getTopicIcon(topic: string): string | undefined {
  const preset = TOPIC_PRESETS.find((p) => p.id === topic);
  return preset?.icon;
}
